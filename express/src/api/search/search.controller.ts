import { validate } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import { Request, Response } from "express";
import housekeepersSchema from "./schemas/housekeepers.schema";

/**
 * POST / - Search housekeepers
 * @param req
 * @param res
 * @returns
 */
const housekeepers = async (req: Request, res: Response) => {
  const { body } = await validate({ req, schema: housekeepersSchema });

  const data = await prisma.housekeeper.findMany({
    select: {
      id: true,
      informations: {
        select: {
          firstName: true,
          lastName: true,
          weekdayRate: true,
          hasVehicle: true,
          hasInsurance: true,
          hasCleaningEquipment: true,
          hasDegree: true,
          yearsOfExperience: true,
          isDeclaredPersonalService: true,
          avatar: {
            select: {
              media: {
                select: {
                  absoluteUrl: true,
                },
              },
            },
          },
        },
      },
    },

    where: {
      informations: {
        status: "APPROVED",
        companyCustomersAllowed: body.customerType === "COMPANY",
        individualCustomersAllowed: body.customerType === "INDIVIDUAL",
        geographicalAreas: {
          some: {
            postalCode: body.postalCode,
          },
        },
        services: {
          some: {
            serviceKey: {
              in: body.services,
            },
          },
        },
        minimumServiceDuration: {
          lte: body.minimumDuration,
        },
      },
    },
  });

  const transformed = data.map((housekeeper) => {
    return {
      ...housekeeper,
      informations: {
        ...housekeeper.informations,
        lastName:
          housekeeper?.informations?.lastName.charAt(0).toUpperCase() + ".",
      },
    };
  });

  return res.json(transformed);
};

export default { housekeepers };
