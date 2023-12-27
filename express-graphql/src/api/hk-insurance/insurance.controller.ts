import mediaServices from "@/src/api/media/media.services";
import { prisma } from "@/src/providers/database/prisma";
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";
import hkInformationsServices from "../hk-informations/hk-informations.services";

const createCertificate = async (
  { account, files }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if files are present
    if (!files) {
      throw createHttpError(400, "Aucun fichier n'a été envoyé.");
    }

    // check if housekeeper informations exists already for this user
    const housekeeperInformations =
      await hkInformationsServices.getHousekeeperInformations({ account });

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

    const file: UploadedFile | UploadedFile[] = files?.file; // get the files with the input name "file"

    // create media
    const media = await mediaServices.store({
      file,
      allowedTypes: ["image/png", "image/jpeg", "application/pdf"],
    });

    // add certificate to insurance
    const insurance = await prisma.housekeeperInsurance.update({
      where: {
        informationsId: housekeeperInformations.id,
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

const findOneCertificate = async (
  { account }: Request,
  res: Response,
  next: NextFunction
) => {
  // check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await hkInformationsServices.getHousekeeperInformations({ account });

  // get housekeeper document
  const insurance = await prisma.housekeeperInsurance.findFirst({
    include: {
      certificateMedia: true,
    },
    where: {
      informationsId: housekeeperInformations.id,
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

const removeCertificate = async (
  { account }: Request,
  res: Response,
  next: NextFunction
) => {
  // check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await hkInformationsServices.getHousekeeperInformations({ account });

  // get housekeeper document
  const insurance = await prisma.housekeeperInsurance.findFirst({
    include: {
      certificateMedia: true,
    },
    where: {
      informationsId: housekeeperInformations.id,
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

export default { createCertificate, findOneCertificate, removeCertificate };
