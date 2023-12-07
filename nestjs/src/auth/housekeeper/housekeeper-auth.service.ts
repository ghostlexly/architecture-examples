import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Housekeeper } from "@prisma/client";

@Injectable()
export class HousekeeperAuthService {
  constructor(private jwtService: JwtService) {}

  createJwtToken(user: Housekeeper) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
