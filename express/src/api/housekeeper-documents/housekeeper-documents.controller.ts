import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { prisma } from "@/src/providers/database/prisma";
import mediaServices from "@/src/api/media/media.services";
import { UploadedFile } from "express-fileupload";
import { User } from "@prisma/client";
import { TypedRequest } from "@/src/middlewares/validate.middleware";
import storeSchema from "./schemas/store.schema";

const save = async ({ user }: Request, res: Response, next: NextFunction) => {
  // check if housekeeper informations exists already for this user
  const housekeeperInformations = await getHousekeeperInformations({ user });

  // -----------------
  // get all documents
  // -----------------
  const documents = await prisma.housekeeperDocument.findMany({
    where: {
      housekeeperInformationsId: housekeeperInformations.id,
    },
  });

  // -----------------
  // sort the documents
  // -----------------
  let hasIdentityCardFront = false;
  let hasIdentityCardBack = false;
  let hasKbis = false;

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];

    switch (document.type) {
      case "IDENTITY_CARD_FRONT":
        hasIdentityCardFront = true;
        break;

      case "IDENTITY_CARD_BACK":
        hasIdentityCardBack = true;
        break;

      case "KBIS":
        hasKbis = true;
        break;
    }
  }

  // -----------------
  // check if all documents are present
  // -----------------
  if (!hasIdentityCardFront) {
    throw createHttpError(
      400,
      "Vous devez transmettre le recto de votre pièce d'identité."
    );
  }

  if (!hasIdentityCardBack) {
    throw createHttpError(
      400,
      "Vous devez transmettre le verso de votre pièce d'identité."
    );
  }

  if (!hasKbis) {
    throw createHttpError(
      400,
      "Vous devez transmettre votre k-bis ou un extrait d'immatriculation."
    );
  }

  // -----------------
  // check if insurance certificate exists and is valid
  // -----------------
  if (housekeeperInformations.hasInsurance) {
    if (!housekeeperInformations.insurance?.certificateMediaId) {
      throw createHttpError(
        400,
        "Vous devez transmettre votre attestation d'assurance."
      );
    }
  }

  // -----------------
  // update housekeeper informations
  // -----------------
  await prisma.housekeeperInformations.update({
    where: {
      id: housekeeperInformations.id,
    },
    data: {
      submissionStep: 6,
      status: "PENDING",
    },
  });

  return res.json({
    message: "Votre dossier a bien été envoyé.",
  });
};

const store = async (
  { params, user, files }: TypedRequest<typeof storeSchema>,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if files are present
    if (!files) {
      throw createHttpError(400, "Aucun fichier n'a été envoyé.");
    }

    if (!user) {
      throw createHttpError(400, "Vous devez être connecté.");
    }

    // check if housekeeper informations exists already for this user
    const housekeeperInformations = await getHousekeeperInformations({ user });

    // check if a document of this type already exists
    const docCheck = await prisma.housekeeperDocument.findFirst({
      where: {
        type: params.type,
        housekeeperInformationsId: housekeeperInformations.id,
      },
    });

    if (docCheck) {
      throw createHttpError(
        400,
        "Vous ne pouvez envoyer qu'un seul fichier. \n Supprimez le fichier précédent pour envoyer un autre fichier."
      );
    }

    let file: UploadedFile | UploadedFile[] = files?.file; // get the files with the input name "file"

    // create media
    const media = await mediaServices.store({
      file,
      allowedTypes: ["image/png", "image/jpeg", "application/pdf"],
    });

    // create housekeeper document
    const housekeeperDocument = await prisma.housekeeperDocument.create({
      data: {
        type: params.type,
        mediaId: media.id,
        housekeeperInformationsId: housekeeperInformations.id,
      },
    });

    return res.json({
      id: housekeeperDocument.id,
      ...mediaServices.getMetaInformations({ media }),
    });
  } catch (err) {
    return next(createHttpError(400, err));
  }
};

const show = async (
  { user, params }: TypedRequest<typeof storeSchema>,
  res: Response,
  next: NextFunction
) => {
  // check if housekeeper informations exists already for this user
  const housekeeperInformations = await getHousekeeperInformations({ user });

  // get housekeeper document
  const housekeeperDocument = await prisma.housekeeperDocument.findFirst({
    include: {
      media: true,
    },
    where: {
      type: params.type,
      housekeeperInformationsId: housekeeperInformations.id,
    },
  });

  if (!housekeeperDocument) {
    throw createHttpError(404, "Ce document n'existe pas.");
  }

  return res.json([
    {
      id: housekeeperDocument.id,
      ...mediaServices.getMetaInformations({
        media: housekeeperDocument.media,
      }),
    },
  ]);
};

const destroy = async (
  { params, user }: TypedRequest<typeof storeSchema>,
  res: Response
) => {
  // check if housekeeper informations exists already for this user
  const housekeeperInformations = await getHousekeeperInformations({ user });

  // find the document
  const housekeeperDocument = await prisma.housekeeperDocument.findFirst({
    include: {
      media: true,
    },
    where: {
      type: params.type,
      housekeeperInformationsId: housekeeperInformations.id,
      status: "PENDING",
    },
  });

  if (!housekeeperDocument) {
    throw createHttpError(400, "Ce document n'existe pas.");
  }

  // delete the document
  await prisma.housekeeperDocument.delete({
    where: {
      id: housekeeperDocument.id,
    },
  });

  // delete media (should be last operation)
  mediaServices.destroy({
    media: housekeeperDocument.media,
  });

  return res.json({
    message: "Le document a bien été supprimé.",
  });
};

const getHousekeeperInformations = async ({ user }: { user: User }) => {
  const housekeeperInformations =
    await prisma.housekeeperInformations.findFirst({
      include: {
        insurance: true,
      },
      where: {
        ownerId: user?.id,
      },
    });

  if (!housekeeperInformations) {
    throw createHttpError(400, "Ce dossier n'existe pas.");
  }

  return housekeeperInformations;
};

export default { store, show, destroy, save };
