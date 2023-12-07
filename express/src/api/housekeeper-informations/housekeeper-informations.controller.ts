import { TypedRequest } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import { Address } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import updateSchema from "./schemas/update.schema";
import storeProInfosSchema from "./schemas/store-pro-infos.schema";
import hkInterventionsSchema from "./schemas/hk-interventions.schema";
import storeSchema from "./schemas/store.schema";

const index = async (
  { user, query }: Request,
  res: Response,
  next: NextFunction
) => {
  const housekeeperInformations =
    await prisma.housekeeperInformations.findFirst({
      include: {
        companyAddress: true,
        geographicalAreas: query["geographical-areas"] === "true",
        insurance: query["insurance"] === "true",
        personalService: query["personal-service"] === "true",
        services: query["services"] === "true",
      },
      where: {
        ownerId: user.id,
      },
    });

  res.json(housekeeperInformations);
};

const store = async (
  { body, user }: TypedRequest<typeof storeSchema>,
  res: Response,
  next: NextFunction
) => {
  // -- check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await prisma.housekeeperInformations.findFirst({
      where: {
        ownerId: user.id,
      },
    });
  if (housekeeperInformations) {
    throw createHttpError(400, "Vous avez déjà complété vos informations.");
  }

  // ---------------------
  // create housekeeper informations
  // ---------------------
  const data = await prisma.housekeeperInformations.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      nationality: body.nationality,
      phoneNumber: body.phoneNumber,
      submissionStep: 1,
      ownerId: user.id,
    },
  });

  res.json(data);
};

const patchProfessionalInfos = async (
  { body, params, user }: TypedRequest<typeof storeProInfosSchema>,
  res: Response,
  next: NextFunction
) => {
  // ---------------------
  // check if housekeeper informations exists already for this user
  // ---------------------
  const housekeeperInformations =
    await prisma.housekeeperInformations.findFirst({
      include: {
        insurance: true,
        personalService: true,
      },
      where: {
        id: params.id,
      },
    });

  if (!housekeeperInformations || housekeeperInformations.ownerId !== user.id) {
    throw createHttpError(400, "Ce dossier n'existe pas.");
  }

  const data = await prisma.$transaction(async (prisma) => {
    let companyAddress: Address;

    // ---------------------
    // company address
    // ---------------------
    if (housekeeperInformations.companyAddressId) {
      // update company address
      companyAddress = await prisma.address.update({
        where: {
          id: housekeeperInformations.companyAddressId,
        },
        data: {
          address: body.companyAddressAddress,
          addressDetails: body.companyAddressAddressDetails,
          postalCode: body.companyAddressPostalCode,
          city: body.companyAddressCity,
          country: "FR",
          ownerId: user.id,
        },
      });
    } else {
      // create company address if it's doesn't exists
      companyAddress = await prisma.address.create({
        data: {
          address: body.companyAddressAddress,
          addressDetails: body.companyAddressAddressDetails,
          postalCode: body.companyAddressPostalCode,
          city: body.companyAddressCity,
          country: "FR",
          ownerId: user.id,
        },
      });
    }

    // ---------------------
    // housekeeper insurance
    // ---------------------
    if (body.hasInsurance) {
      if (housekeeperInformations.insurance) {
        // update hk insurance informations
        await prisma.housekeeperInsurance.update({
          where: {
            id: housekeeperInformations.insurance.id,
          },
          data: {
            ...body.insurance,
          },
        });
      } else {
        // create hk insurance informations
        await prisma.housekeeperInsurance.create({
          data: {
            ...body.insurance,
            housekeeperInformationsId: housekeeperInformations.id,
          },
        });
      }
    } else if (housekeeperInformations.insurance) {
      // delete the existent insurance infos if the user has checked no insurance checkbox
      await prisma.housekeeperInsurance.delete({
        where: {
          id: housekeeperInformations.insurance.id,
        },
      });
    }

    // ---------------------
    // housekeeper personal service
    // ---------------------
    if (body.isDeclaredPersonalService) {
      if (housekeeperInformations.personalService) {
        // update hk personal service informations
        await prisma.housekeeperPersonalService.update({
          where: {
            id: housekeeperInformations.personalService.id,
          },
          data: {
            ...body.personalService,
          },
        });
      } else {
        // create hk personal service informations
        await prisma.housekeeperPersonalService.create({
          data: {
            ...body.personalService,
            housekeeperInformationsId: housekeeperInformations.id,
          },
        });
      }
    } else if (housekeeperInformations.personalService) {
      // delete the existent personal service if the user has checked no personal service checkbox
      await prisma.housekeeperPersonalService.delete({
        where: {
          id: housekeeperInformations.personalService.id,
        },
      });
    }

    // ---------------------
    // update housekeeper informations
    // ---------------------
    return await prisma.housekeeperInformations.update({
      where: {
        id: housekeeperInformations.id,
      },
      data: {
        companyName: body.companyName,
        siretNumber: body.siretNumber,
        ownerId: user.id,
        companyAddressId: companyAddress.id,
        submissionStep: 2,
        hasInsurance: body.hasInsurance,
        isDeclaredPersonalService: body.isDeclaredPersonalService,
      },
    });
  });

  res.json(data);
};

const update = async (
  { body, params, user }: TypedRequest<typeof updateSchema>,
  res: Response,
  next: NextFunction
) => {
  // -- check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await prisma.housekeeperInformations.findFirst({
      where: {
        id: params.id,
      },
    });

  if (!housekeeperInformations || housekeeperInformations.ownerId !== user.id) {
    throw createHttpError(400, "Ce dossier n'existe pas.");
  }

  // -- update housekeeper informations
  let data = await prisma.housekeeperInformations.update({
    where: {
      id: housekeeperInformations.id,
    },
    data: {
      firstName: body?.firstName,
      lastName: body?.lastName,
      phoneNumber: body?.phoneNumber,
      nationality: body?.nationality,
      dateOfBirth: body?.dateOfBirth,
    },
  });

  res.json(data);
};

const interventions = async (
  { body, params, user }: TypedRequest<typeof hkInterventionsSchema>,
  res: Response,
  next: NextFunction
) => {
  // -- check if housekeeper informations exists already for this user
  const housekeeperInformations =
    await prisma.housekeeperInformations.findFirst({
      where: {
        ownerId: user.id,
      },
    });

  if (!housekeeperInformations) {
    throw createHttpError(400, "Ce dossier n'existe pas.");
  }

  // ---------------------
  // clear connected hk services
  // ---------------------
  await prisma.housekeepersOnServices.deleteMany({
    where: {
      housekeeperInformationsId: housekeeperInformations.id,
    },
  });

  // -- update housekeeper informations
  let data = await prisma.housekeeperInformations.update({
    where: {
      id: housekeeperInformations.id,
    },
    data: {
      businessCustomersAllowed: body?.businessCustomersAllowed,
      individualCustomersAllowed: body?.individualCustomersAllowed,
      hasVehicle: body?.hasVehicle,
      hasCleaningEquipment: body?.hasCleaningEquipment,
      minimumServiceDuration: body?.minimumServiceDuration,
      weekdayRate: body?.weekdayRate,
      sundayHolidayRate: body?.sundayHolidayRate,
      nightRate: body?.nightRate,
      cleaningEquipmentExtraRate: body?.cleaningEquipmentExtraRate,
      vatRate: body?.vatRate,
      services: {
        createMany: {
          data: body?.services.map((service) => {
            return {
              housekeeperServiceKey: service,
            };
          }),
        },
      },
      submissionStep: 3,
    },
  });

  res.json(data);
};

export default { store, index, update, interventions, patchProfessionalInfos };
