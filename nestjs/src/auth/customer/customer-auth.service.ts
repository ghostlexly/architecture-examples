import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Customer } from "@prisma/client";

@Injectable()
export class CustomerAuthService {
  constructor(private jwtService: JwtService) {}

  createJwtToken(user: Customer) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
