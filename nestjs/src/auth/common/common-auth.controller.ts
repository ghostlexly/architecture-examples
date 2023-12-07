import { Controller, Get, UseGuards } from "@nestjs/common";
import { JWTAuthGuard } from "./guards/jwt.guard";
import { AuthUser } from "src/decorators/auth-user.decorator";

@Controller("auth")
export class CommonAuthController {
  @Get("me")
  @UseGuards(JWTAuthGuard)
  getMe(@AuthUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
