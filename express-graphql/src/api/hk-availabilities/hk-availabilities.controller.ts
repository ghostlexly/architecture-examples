import { TypedRequest } from "@/src/middlewares/validate.middleware";
import { prisma } from "@/src/providers/database/prisma";
import dayjs from "dayjs";
import { Request, Response } from "express";
import removeSchema from "./schemas/remove.schema";
import createSchema from "./schemas/create.schema";

const findAll = async ({ account, meta }: Request, res: Response) => {
  const data = await prisma.housekeeperAvailability.findMany({
    include: {
      intervals: true,
    },
    where: {
      ownerId: account.housekeeper.id,
      date: {
        gte: dayjs.utc().startOf("day").toDate(),
      },
    },
    ...meta.sorting,
  });

  return res.json(data);
};

const create = async (
  { body, account }: TypedRequest<typeof createSchema>,
  res: Response
) => {
  const startDate = dayjs.utc(body.startDate);
  const endDate = dayjs.utc(body.endDate);
  const daysDifference = endDate.diff(startDate, "day");

  // --------------------
  // loop through each day between startDate and endDate
  // --------------------
  for (let i = 0; i <= daysDifference; i++) {
    const actualDate = startDate.add(i + 1, "day");

    // --------------------
    // check if availability already exists for this date and delete it
    // --------------------
    const availability = await prisma.housekeeperAvailability.findFirst({
      where: {
        ownerId: account.housekeeper.id,
        date: actualDate.utc().startOf("day").toDate(),
      },
    });

    if (availability) {
      await prisma.housekeeperAvailability.delete({
        where: {
          id: availability.id,
        },
      });
    }

    // --------------------
    // create new availability
    // --------------------
    await prisma.housekeeperAvailability.create({
      data: {
        ownerId: account.housekeeper.id,
        date: actualDate.toDate(),
        intervals: {
          createMany: {
            data: body.intervals.map((interval) => ({
              startTime: actualDate
                .set("hour", parseInt(interval.startTime.split(":")[0]))
                .set("minute", parseInt(interval.startTime.split(":")[1]))
                .toDate(),
              endTime: actualDate
                .set("hour", parseInt(interval.endTime.split(":")[0]))
                .set("minute", parseInt(interval.endTime.split(":")[1]))
                .toDate(),
            })),
          },
        },
      },
    });
  }

  return res.json({
    success: true,
  });
};

const remove = async (
  { params, account }: TypedRequest<typeof removeSchema>,
  res: Response
) => {
  await prisma.housekeeperAvailability.delete({
    where: {
      id: params.id,
      ownerId: account.housekeeper.id,
    },
  });

  return res.json({
    success: true,
  });
};

export default { findAll, create, remove };
