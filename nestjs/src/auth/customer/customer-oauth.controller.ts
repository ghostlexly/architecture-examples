import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { CustomerAuthService } from "./customer-auth.service";
import { IsPublic } from "src/decorators/is-public.decorator";
import { AuthGuard } from "@nestjs/passport";

@Controller("oauth2/customer")
export class CustomerOAuthController {
  constructor(private authService: CustomerAuthService) {}

  @Get("google")
  @IsPublic()
  @UseGuards(AuthGuard("customer-google"))
  googleLogin() {
    return {};
  }

  @Get("callback/google")
  @IsPublic()
  @UseGuards(AuthGuard("customer-google"))
  googleLoginCallback(@Request() req) {
    return {
      access_token: this.authService.createJwtToken(req.user),
    };
  }
}
