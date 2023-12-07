import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { StoreDto } from "./schemas/store.schema";
import { Roles } from "src/decorators/roles.decorator";
import { AuthUser } from "src/decorators/auth-user.decorator";
import { Housekeeper } from "@prisma/client";
import { PrismaProvider } from "src/providers/database/prisma.provider";
import dayjs from "dayjs";
import { MetaSortingPipe } from "src/lib/meta/sorting.pipe";

@Controller("hk-availabilities")
@Roles(["HOUSEKEEPER"])
export class HkAvailabilitiesController {
  constructor(private prisma: PrismaProvider) {}

  @Get()
  async index(
    @AuthUser() housekeeper: Housekeeper,
    @Query("orderBy", new MetaSortingPipe()) orderBy: any,
  ) {
    return this.prisma.housekeeperAvailability.findMany({
      where: {
        ownerId: housekeeper.id,
      },
      include: {
        intervals: true,
      },
      ...orderBy,
    });
  }

  @Post()
  async store(@AuthUser() housekeeper: Housekeeper, @Body() body: StoreDto) {
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
      const availability = await this.prisma.housekeeperAvailability.findFirst({
        where: {
          ownerId: housekeeper.id,
          date: actualDate.utc().startOf("day").toDate(),
        },
      });

      if (availability) {
        await this.prisma.housekeeperAvailability.delete({
          where: {
            id: availability.id,
          },
        });
      }

      // --------------------
      // create new availability
      // --------------------
      await this.prisma.housekeeperAvailability.create({
        data: {
          ownerId: housekeeper.id,
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

    return {
      success: true,
    };
  }

  @Delete(":id")
  destroy(@AuthUser() housekeeper: Housekeeper, @Param("id") id: string) {
    return this.prisma.housekeeperAvailability.delete({
      where: {
        id,
        ownerId: housekeeper.id,
      },
    });
  }
}
