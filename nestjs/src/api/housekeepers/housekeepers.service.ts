import { Injectable } from "@nestjs/common";
import { Role } from "@prisma/client";
import { PrismaProvider } from "src/providers/database/prisma.provider";

@Injectable()
export class HousekeepersService {
  constructor(private prisma: PrismaProvider) {}

  async findOne(email: string) {
    const user = await this.prisma.housekeeper.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }

  async findOneByRole(email: string, role: Role) {
    const user = await this.prisma.housekeeper.findUnique({
      where: {
        email: email,
        role: role,
      },
    });

    return user;
  }
}
