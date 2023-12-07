import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { PrismaProvider } from "src/providers/database/prisma.provider";
import { RegisterDto } from "./schemas/register.schema";
import { IsPublic } from "src/decorators/is-public.decorator";

@Controller("customers")
export class CustomersController {
  constructor(private prisma: PrismaProvider) {}

  @Post("register")
  @IsPublic()
  async register(@Body() body: RegisterDto) {
    // --------------------------------
    // Validations
    // --------------------------------

    // Check user e-mail is not already used
    const user = await this.prisma.customer.findFirst({
      where: { email: body.email },
    });
    if (user) {
      throw new BadRequestException("Cette adresse e-mail est déjà utilisée.");
    }

    // --------------------------------
    // Create user
    // --------------------------------
    await this.prisma.customer.create({
      data: {
        ...body,
        role: "CUSTOMER",
      },
    });

    return { message: "Votre compte a bien été créé." };
  }
}
