import { prisma } from "@/src/providers/database/prisma";
import mediaServices from "@/src/api/media/media.services";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import createHttpError from "http-errors";

const store = async (
  { user, files }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!user) {
      throw createHttpError.Forbidden("Vous devez être connecté.");
    }

    // check if files are present
    if (!files) {
      throw createHttpError.BadRequest("Aucun fichier n'a été envoyé.");
    }

    // check if housekeeper informations exists already for this user
    const housekeeperInformations = await getHousekeeperInformations({ user });

    let file: UploadedFile | UploadedFile[] = files?.file; // get the files with the input name "file"

    // create media
    const media = await mediaServices.store({
      file,
      allowedTypes: ["image/png", "image/jpeg"],
    });

    // create avatar
    const avatar = await prisma.housekeeperAvatar.create({
      data: {
        housekeeperInformationsId: housekeeperInformations.id,
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

const show = async ({ user }: Request, res: Response, next: NextFunction) => {
  if (!user) {
    throw createHttpError.Forbidden("Vous devez être connecté.");
  }

  // check if housekeeper informations exists already for this user
  const housekeeperInformations = await getHousekeeperInformations({ user });

  // get housekeeper document
  const avatar = await prisma.housekeeperAvatar.findFirst({
    include: {
      media: true,
    },
    where: {
      housekeeperInformationsId: housekeeperInformations.id,
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

const destroy = async (
  { user }: Request,
  res: Response,
  next: NextFunction
) => {
  if (!user) {
    throw createHttpError.Forbidden("Vous devez être connecté.");
  }

  // check if housekeeper informations exists already for this user
  const housekeeperInformations = await getHousekeeperInformations({ user });

  // get housekeeper document
  const avatar = await prisma.housekeeperAvatar.findFirst({
    include: {
      media: true,
    },
    where: {
      housekeeperInformationsId: housekeeperInformations.id,
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

const getHousekeeperInformations = async ({ user }: { user: User }) => {
  const housekeeperInformations =
    await prisma.housekeeperInformations.findFirst({
      where: {
        ownerId: user?.id,
      },
    });

  if (!housekeeperInformations) {
    throw createHttpError(400, "Ce dossier n'existe pas.");
  }

  return housekeeperInformations;
};

export default { store, show, destroy };
