import mediaServices from "@/src/api/media/media.services";
import { validate } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";
import hkInformationsServices from "../hk-informations/hk-informations.services";
import storeSchema from "./schemas/store.schema";

const save = async (
  { account }: Request,
  res: Response,
  next: NextFunction
) => {
  // check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await hkInformationsServices.getHousekeeperInformations({ account });

  // -----------------
  // get all documents
  // -----------------
  const documents = await prisma.housekeeperDocument.findMany({
    where: {
      informationsId: housekeeperInformations.id,
    },
  });

  // -----------------
  // sort the documents
  // -----------------
  let hasIdentityCardFront = false;
  let hasIdentityCardBack = false;
  let hasINPI = false;

  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];

    switch (document.type) {
      case "IDENTITY_CARD_FRONT":
        hasIdentityCardFront = true;
        break;

      case "IDENTITY_CARD_BACK":
        hasIdentityCardBack = true;
        break;

      case "INPI":
        hasINPI = true;
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

  if (!hasINPI) {
    throw createHttpError(
      400,
      "Vous devez transmettre votre extrait d'inscription INPI."
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
  await prisma.housekeeperInformation.update({
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

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { params } = await validate({ req, schema: storeSchema });
  const { account, files } = req;

  try {
    // check if files are present
    if (!files) {
      throw createHttpError(400, "Aucun fichier n'a été envoyé.");
    }

    // check if housekeeper informations exists already for this user
    const housekeeperInformations =
      await hkInformationsServices.getHousekeeperInformations({ account });

    // check if a document of this type already exists
    const docCheck = await prisma.housekeeperDocument.findFirst({
      where: {
        type: params.type,
        informationsId: housekeeperInformations.id,
      },
    });

    if (docCheck) {
      throw createHttpError(
        400,
        "Vous ne pouvez envoyer qu'un seul fichier. \n Supprimez le fichier précédent pour envoyer un autre fichier."
      );
    }

    const file: UploadedFile | UploadedFile[] = files?.file; // get the files with the input name "file"

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
        informationsId: housekeeperInformations.id,
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

const findOne = async (req: Request, res: Response, next: NextFunction) => {
  const { params } = await validate({ req, schema: storeSchema });
  const { account } = req;

  // check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await hkInformationsServices.getHousekeeperInformations({ account });

  // get housekeeper document
  const housekeeperDocument = await prisma.housekeeperDocument.findFirst({
    include: {
      media: true,
    },
    where: {
      type: params.type,
      informationsId: housekeeperInformations.id,
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

const remove = async (req: Request, res: Response) => {
  const { params } = await validate({ req, schema: storeSchema });
  const { account } = req;

  // check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await hkInformationsServices.getHousekeeperInformations({ account });

  // find the document
  const housekeeperDocument = await prisma.housekeeperDocument.findFirst({
    include: {
      media: true,
    },
    where: {
      type: params.type,
      informationsId: housekeeperInformations.id,
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

export default { create, findOne, remove, save };
