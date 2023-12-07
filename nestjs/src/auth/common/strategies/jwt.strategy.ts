import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { PrismaProvider } from "src/providers/database/prisma.provider";
import { Role } from "@prisma/client";

// -----------------------------------------------------------------------------
// This strategy is used to authenticate users based on the JWT token submitted
// alongside their request in the Authorization header.
// It's checks the token's signature inside the super()'s function call.
// This strategy is not called on login !
// -----------------------------------------------------------------------------

export type JwtPayload = {
  sub: string;
  username: string;
  role: Role;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private prisma: PrismaProvider) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Check the Authorization header for a valid JWT token and return the payload
  async validate(payload: JwtPayload) {
    // get the user from database
    if (payload.role === "HOUSEKEEPER") {
      return await this.prisma.housekeeper.findUnique({
        where: { id: payload.sub },
      });
    } else if (payload.role === "CUSTOMER") {
      return await this.prisma.customer.findUnique({
        where: { id: payload.sub },
      });
    } else {
      return {
        id: payload.sub,
        username: payload.username,
        role: payload.role,
      };
    }
  }
}
