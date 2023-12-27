import mediaServices from "@/src/api/media/media.services";
import { prisma } from "@/src/providers/database/prisma";
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";
import hkInformationsServices from "../hk-informations/hk-informations.services";

const create = async (
  { account, files }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // check if files are present
    if (!files) {
      throw createHttpError.BadRequest("Aucun fichier n'a été envoyé.");
    }

    // check if housekeeper informations exists already for this user
    const housekeeperInformations =
      await hkInformationsServices.getHousekeeperInformations({ account });

    const file: UploadedFile | UploadedFile[] = files?.file; // get the files with the input name "file"

    // create media
    const media = await mediaServices.store({
      file,
      allowedTypes: ["image/png", "image/jpeg"],
    });

    // create avatar
    const avatar = await prisma.housekeeperAvatar.create({
      data: {
        informationsId: housekeeperInformations.id,
        mediaId: media.id,
      },
    });

    return res.json({
      id: avatar.id,
      ...mediaServices.getMetaInformations({ media }),
    });
  } catch (err) {
    return next(createHttpError(400, err));
  }
};

const findOne = async (
  { account }: Request,
  res: Response,
  next: NextFunction
) => {
  // check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await hkInformationsServices.getHousekeeperInformations({ account });

  // get housekeeper document
  const avatar = await prisma.housekeeperAvatar.findFirst({
    include: {
      media: true,
    },
    where: {
      informationsId: housekeeperInformations.id,
    },
  });

  if (!avatar) {
    throw createHttpError.NotFound("Cet avatar n'existe pas.");
  }

  return res.json([
    {
      id: avatar.id,
      ...mediaServices.getMetaInformations({
        media: avatar.media,
      }),
    },
  ]);
};

const remove = async (
  { account }: Request,
  res: Response,
  next: NextFunction
) => {
  // check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await hkInformationsServices.getHousekeeperInformations({ account });

  // get housekeeper document
  const avatar = await prisma.housekeeperAvatar.findFirst({
    include: {
      media: true,
    },
    where: {
      informationsId: housekeeperInformations.id,
    },
  });

  if (!avatar) {
    throw createHttpError.NotFound("Cet avatar n'existe pas.");
  }

  // delete avatar
  await prisma.housekeeperAvatar.delete({
    where: {
      id: avatar.id,
    },
  });

  // delete media
  await mediaServices.destroy({ media: avatar.media });

  return res.json({
    message: "Avatar supprimé avec succès.",
  });
};

export default { create, findOne, remove };
