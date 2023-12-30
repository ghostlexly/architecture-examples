import { prisma } from "@/src/providers/database/prisma";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import storeSchema from "./schemas/store.schema";
import { validate } from "@/src/middlewares/validate.middleware";

const findAll = async (
  { account }: Request,
  res: Response,
  next: NextFunction
) => {
  const housekeeperInformations = await prisma.housekeeperInformation.findFirst(
    {
      include: {
        geographicalAreas: true,
      },
      where: {
        ownerId: account.housekeeper.id,
      },
    }
  );

  if (!housekeeperInformations) {
    throw createHttpError(
      400,
      "Vous devez compléter vos informations avant de pouvoir ajouter des zones géographiques."
    );
  }

  return res.json(housekeeperInformations?.geographicalAreas);
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  const { body } = await validate({ req, schema: storeSchema });
  const { account } = req;

  // -- find the housekeeper informations id
  const housekeeperInformations = await prisma.housekeeperInformation.findFirst(
    {
      where: {
        ownerId: account.housekeeper.id,
      },
    }
  );

  if (!housekeeperInformations) {
    throw createHttpError(
      400,
      "Vous devez compléter vos informations avant de pouvoir ajouter des zones géographiques."
    );
  }

  // -- find all geographical areas for this housekeeper and remove them
  await prisma.housekeeperGeographicalArea.deleteMany({
    where: {
      informationsId: housekeeperInformations.id,
    },
  });

  // -- then add the new housekeeper areas
  await prisma.housekeeperGeographicalArea.createMany({
    data: body.postalCode.map((area) => ({
      informationsId: housekeeperInformations.id,
      postalCode: area,
    })),
  });

  // -- update the submission step
  await prisma.housekeeperInformation.update({
    where: {
      id: housekeeperInformations.id,
    },
    data: {
      submissionStep: 4,
    },
  });

  return res.json(body);
};

export default { create, findAll };
