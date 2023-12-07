import { prisma } from "@/src/providers/database/prisma";
import mediaServices from "@/src/api/media/media.services";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";

const storeCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user) {
      throw createHttpError(400, "Vous devez être connecté.");
    }

    // check if files are present
    if (!req.files) {
      throw createHttpError(400, "Aucun fichier n'a été envoyé.");
    }

    // check if housekeeper informations exists already for this user
    const housekeeperInformations = await getHousekeeperInformations({ user });

    // check if personal service is declared
    if (
      !housekeeperInformations.hasInsurance ||
      !housekeeperInformations.insurance
    ) {
      throw createHttpError(
        400,
        "Vous devez déclarer votre assurance avant de pouvoir ajouter un certificat."
      );
    }

    let file: UploadedFile | UploadedFile[] = req.files?.file; // get the files with the input name "file"

    // create media
    const media = await mediaServices.store({
      file,
      allowedTypes: ["image/png", "image/jpeg", "application/pdf"],
    });

    // add certificate to insurance
    const insurance = await prisma.housekeeperInsurance.update({
      where: {
        housekeeperInformationsId: housekeeperInformations.id,
      },
      data: {
        certificateMediaId: media.id,
      },
    });

    return res.json({
      id: insurance.id,
      ...mediaServices.getMetaInformations({ media }),
    });
  } catch (err) {
    return next(createHttpError(400, err));
  }
};

const showCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    throw createHttpError(400, "Vous devez être connecté.");
  }

  // check if housekeeper informations exists already for this user
  const housekeeperInformations = await getHousekeeperInformations({ user });

  // get housekeeper document
  const insurance = await prisma.housekeeperInsurance.findFirst({
    include: {
      certificateMedia: true,
    },
    where: {
      housekeeperInformationsId: housekeeperInformations.id,
    },
  });

  if (!insurance || !insurance.certificateMedia) {
    throw createHttpError(404, "Ce certificat n'existe pas.");
  }

  return res.json([
    {
      id: insurance.id,
      ...mediaServices.getMetaInformations({
        media: insurance.certificateMedia,
      }),
    },
  ]);
};

const destroyCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (!user) {
    throw createHttpError(400, "Vous devez être connecté.");
  }

  // check if housekeeper informations exists already for this user
  const housekeeperInformations = await getHousekeeperInformations({ user });

  // get housekeeper document
  const insurance = await prisma.housekeeperInsurance.findFirst({
    include: {
      certificateMedia: true,
    },
    where: {
      housekeeperInformationsId: housekeeperInformations.id,
    },
  });

  if (!insurance || !insurance.certificateMedia) {
    throw createHttpError(404, "Ce certificat n'existe pas.");
  }

  // delete certificate from insurance table
  await prisma.housekeeperInsurance.update({
    where: {
      id: insurance.id,
    },
    data: {
      certificateMedia: undefined,
    },
  });

  // delete media
  await mediaServices.destroy({ media: insurance.certificateMedia });

  return res.json({
    message: "Certificat supprimé avec succès.",
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

export default { storeCertificate, showCertificate, destroyCertificate };
