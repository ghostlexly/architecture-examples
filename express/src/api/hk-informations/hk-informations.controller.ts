import { TypedRequest, validate } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import updateSchema from "./schemas/update.schema";
import storeProInfosSchema from "./schemas/store-pro-infos.schema";
import hkInterventionsSchema from "./schemas/hk-interventions.schema";
import storeSchema from "./schemas/store.schema";
import { HousekeeperAddress } from "@prisma/client";
import parsePhoneNumberFromString from "libphonenumber-js";

/**
 * Find one housekeeper informations
 *
 * @route /
 * @param param0
 * @param res
 * @param next
 */
const findOne = async (
  { account, query }: Request,
  res: Response,
  next: NextFunction
) => {
  const housekeeperInformations = await prisma.housekeeperInformation.findFirst(
    {
      include: {
        companyAddress: true,
        geographicalAreas: query["geographical-areas"] === "true",
        insurance: query["insurance"] === "true",
        personalService: query["personal-service"] === "true",
        services: query["services"] === "true",
      },
      where: {
        ownerId: account.housekeeper.id,
      },
    }
  );

  res.json(housekeeperInformations ?? {});
};

/**
 * Create housekeeper informations
 *
 * @route /
 * @param param0
 * @param res
 * @param next
 */
const create = async (req: Request, res: Response, next: NextFunction) => {
  const { body } = await validate({ req, schema: storeSchema });
  const { account } = req;

  /**
   * ---------------------
   * Transform phone number to international format
   * ---------------------
   */
  const parsedPhoneNumber = parsePhoneNumberFromString(body.phoneNumber, "FR");

  if (!parsedPhoneNumber) {
    throw createHttpError.BadRequest("Numéro de téléphone invalide.");
  }

  body.phoneNumber = parsedPhoneNumber.formatInternational();

  // -- check if housekeeper informations exists already for this user
  const housekeeperInformations = await prisma.housekeeperInformation.findFirst(
    {
      where: {
        ownerId: account.housekeeper.id,
      },
    }
  );
  if (housekeeperInformations) {
    throw createHttpError(400, "Vous avez déjà complété vos informations.");
  }

  // ---------------------
  // create housekeeper informations
  // ---------------------
  const data = await prisma.housekeeperInformation.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      nationality: body.nationality,
      phoneNumber: body.phoneNumber,
      submissionStep: 1,
      ownerId: account.housekeeper.id,
    },
  });

  res.json(data);
};

/**
 * Update housekeeper professional informations
 *
 * @route /:id/professional-informations
 * @param param0
 * @param res
 * @param next
 */
const updateProfessionalInfos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body, params } = await validate({ req, schema: storeProInfosSchema });
  const { account } = req;

  // ---------------------
  // check if housekeeper informations exists already for this user
  // ---------------------
  const housekeeperInformations = await prisma.housekeeperInformation.findFirst(
    {
      include: {
        insurance: true,
        personalService: true,
      },
      where: {
        id: params.id,
        ownerId: account.housekeeper.id,
      },
    }
  );

  if (!housekeeperInformations) {
    throw createHttpError(400, "Ce dossier n'existe pas.");
  }

  const data = await prisma.$transaction(async (prisma) => {
    let companyAddress: HousekeeperAddress;

    // ---------------------
    // company address
    // ---------------------
    if (housekeeperInformations.companyAddressId) {
      // update company address
      companyAddress = await prisma.housekeeperAddress.update({
        where: {
          id: housekeeperInformations.companyAddressId,
        },
        data: {
          address: body.companyAddressAddress,
          addressDetails: body.companyAddressAddressDetails,
          postalCode: body.companyAddressPostalCode,
          city: body.companyAddressCity,
          country: "FR",
          ownerId: account.housekeeper.id,
        },
      });
    } else {
      // create company address if it's doesn't exists
      companyAddress = await prisma.housekeeperAddress.create({
        data: {
          address: body.companyAddressAddress,
          addressDetails: body.companyAddressAddressDetails,
          postalCode: body.companyAddressPostalCode,
          city: body.companyAddressCity,
          country: "FR",
          ownerId: account.housekeeper.id,
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
            informationsId: housekeeperInformations.id,
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
            informationsId: housekeeperInformations.id,
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
    return await prisma.housekeeperInformation.update({
      where: {
        id: housekeeperInformations.id,
      },
      data: {
        companyName: body.companyName,
        siretNumber: body.siretNumber,
        ownerId: account.housekeeper.id,
        companyAddressId: companyAddress.id,
        submissionStep: 2,
        hasInsurance: body.hasInsurance,
        hasDegree: body.hasDegree,
        isDeclaredPersonalService: body.isDeclaredPersonalService,
        yearsOfExperience: body.yearsOfExperience,
      },
    });
  });

  res.json(data);
};

/**
 * Update housekeeper informations
 *
 * @method PATCH
 * @route /:id
 * @param param0
 * @param res
 * @param next
 */
const update = async (req: Request, res: Response, next: NextFunction) => {
  const { body, params } = await validate({ req, schema: updateSchema });
  const { account } = req;

  /**
   * ---------------------
   * Transform phone number to international format
   * ---------------------
   */
  if (body.phoneNumber) {
    const parsedPhoneNumber = parsePhoneNumberFromString(
      body.phoneNumber,
      "FR"
    );

    if (!parsedPhoneNumber) {
      throw createHttpError.BadRequest("Numéro de téléphone invalide.");
    }

    body.phoneNumber = parsedPhoneNumber.formatInternational();
  }

  /**
   * -------------------
   * Check if housekeeper informations exists already for this user
   * -------------------
   */
  const housekeeperInformations = await prisma.housekeeperInformation.findFirst(
    {
      where: {
        id: params.id,
        ownerId: account.housekeeper.id,
      },
    }
  );

  if (!housekeeperInformations) {
    throw createHttpError(400, "Ce dossier n'existe pas.");
  }

  /**
   * -------------------
   * Update housekeeper informations
   * -------------------
   */
  const data = await prisma.housekeeperInformation.update({
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

/**
 * Patch housekeeper interventions
 *
 * @route /:id/interventions
 * @param param0
 * @param res
 * @param next
 */
const updateInterventions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body, params } = await validate({
    req,
    schema: hkInterventionsSchema,
  });
  const { account } = req;

  // -- check if housekeeper informations exists already for this user
  const housekeeperInformations = await prisma.housekeeperInformation.findFirst(
    {
      where: {
        ownerId: account.housekeeper.id,
      },
    }
  );

  if (!housekeeperInformations) {
    throw createHttpError(400, "Ce dossier n'existe pas.");
  }

  // ---------------------
  // clear connected hk services
  // ---------------------
  await prisma.housekeeperInformationToHousekeeperService.deleteMany({
    where: {
      informationsId: housekeeperInformations.id,
    },
  });

  // -- update housekeeper informations
  const data = await prisma.housekeeperInformation.update({
    where: {
      id: housekeeperInformations.id,
    },
    data: {
      companyCustomersAllowed: body?.companyCustomersAllowed,
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
              serviceKey: service,
            };
          }),
        },
      },
      submissionStep: 3,
    },
  });

  res.json(data);
};

export default {
  create,
  findOne,
  update,
  updateInterventions,
  updateProfessionalInfos,
};
