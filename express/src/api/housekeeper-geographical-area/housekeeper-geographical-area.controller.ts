import { NextFunction, Request, Response } from "express";
import { prisma } from "@/src/providers/database/prisma";
import { User } from "@prisma/client";
import createHttpError from "http-errors";
import { TypedRequest } from "@/src/middlewares/validate.middleware";
import storeSchema from "./schemas/store.schema";

const index = async ({ user }: Request, res: Response, next: NextFunction) => {
  const housekeeperInformations =
    await prisma.housekeeperInformations.findFirst({
      include: {
        geographicalAreas: true,
      },
      where: {
        ownerId: user.id,
      },
    });

  if (!housekeeperInformations) {
    throw createHttpError(
      400,
      "Vous devez compléter vos informations avant de pouvoir ajouter des zones géographiques."
    );
  }

  return res.json(housekeeperInformations?.geographicalAreas);
};

const store = async (
  { user, body }: TypedRequest<typeof storeSchema>,
  res: Response,
  next: NextFunction
) => {
  // -- find the housekeeper informations id
  const housekeeperInformations =
    await prisma.housekeeperInformations.findFirst({
      where: {
        ownerId: user.id,
      },
    });

  if (!housekeeperInformations) {
    throw createHttpError(
      400,
      "Vous devez compléter vos informations avant de pouvoir ajouter des zones géographiques."
    );
  }

  // -- find all geographical areas for this housekeeper and remove them
  await prisma.housekeeperGeographicalArea.deleteMany({
    where: {
      housekeeperInformationsId: housekeeperInformations.id,
    },
  });

  // -- then add the new housekeeper areas
  await prisma.housekeeperGeographicalArea.createMany({
    data: body.postalCode.map((area) => ({
      housekeeperInformationsId: housekeeperInformations.id,
      postalCode: area,
    })),
  });

  // -- update the submission step
  await prisma.housekeeperInformations.update({
    where: {
      id: housekeeperInformations.id,
    },
    data: {
      submissionStep: 4,
    },
  });

  return res.json(body);
};

export default { store, index };
