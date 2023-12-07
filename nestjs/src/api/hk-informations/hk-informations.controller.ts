import { Controller, Get, Query } from "@nestjs/common";
import { Housekeeper } from "@prisma/client";
import { AuthUser } from "src/decorators/auth-user.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { PrismaProvider } from "src/providers/database/prisma.provider";

@Controller("hk-informations")
@Roles(["HOUSEKEEPER"])
export class HkInformationsController {
  constructor(private prisma: PrismaProvider) {}

  @Get()
  async index(
    @AuthUser() housekeeper: Housekeeper,
    @Query("geographical-areas") geographicalAreas?: string,
    @Query("insurance") insurance?: string,
    @Query("personal-service") personalService?: string,
    @Query("services") services?: string,
  ) {
    const hkInformations = await this.prisma.housekeeperInformations.findFirst({
      include: {
        companyAddress: true,
        geographicalAreas: geographicalAreas === "true",
        insurance: insurance === "true",
        personalService: personalService === "true",
        services: services === "true",
      },
      where: {
        ownerId: housekeeper.id,
      },
    });

    return hkInformations ?? {};
  }
}
