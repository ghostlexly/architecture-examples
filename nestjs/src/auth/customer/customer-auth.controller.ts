import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IsPublic } from "src/decorators/is-public.decorator";
import { CustomerAuthService } from "./customer-auth.service";
import { Throttle } from "@nestjs/throttler";

@Controller("auth/customer")
export class CustomerAuthController {
  constructor(private authService: CustomerAuthService) {}

  @Post("login")
  @IsPublic()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AuthGuard("customer-local"))
  login(@Request() req: Request) {
    return {
      access_token: this.authService.createJwtToken(req.user),
      username: req.user.email,
      role: req.user.role,
    };
  }

  // @Get("protected-route-example")
  // @UseGuards(AuthGuard("jwt"))
  // OR
  // @UseGuards(JWTAuthGuard)
  // protectedRouteExample(@Request() req) {
  //   return req.user;
  // }
}
