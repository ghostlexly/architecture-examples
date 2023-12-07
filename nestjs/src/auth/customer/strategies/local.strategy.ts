import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import * as bcrypt from "bcryptjs";
import { PrismaProvider } from "src/providers/database/prisma.provider";

// -----------------------------------------------------------------------------
// This strategy is used to authenticate users based on the username and
// password submitted through a login form.
// -----------------------------------------------------------------------------

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  "customer-local",
) {
  constructor(private prisma: PrismaProvider) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.prisma.customer.findUnique({
      where: {
        email: username,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
