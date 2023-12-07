import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IsPublic } from "src/decorators/is-public.decorator";
import { HousekeeperAuthService } from "./housekeeper-auth.service";

@Controller("oauth2/housekeeper")
export class HousekeeperOAuthController {
  constructor(private authService: HousekeeperAuthService) {}

  @Get("google")
  @IsPublic()
  @UseGuards(AuthGuard("housekeeper-google"))
  googleLogin() {
    return {};
  }

  @Get("callback/google")
  @IsPublic()
  @UseGuards(AuthGuard("housekeeper-google"))
  googleLoginCallback(@Request() req) {
    return {
      access_token: this.authService.createJwtToken(req.user),
    };
  }
}
