import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { IsPublic } from "src/decorators/is-public.decorator";
import { HousekeeperAuthService } from "./housekeeper-auth.service";
import { Throttle } from "@nestjs/throttler";

@Controller("auth/housekeeper")
export class HousekeeperAuthController {
  constructor(private authService: HousekeeperAuthService) {}

  @Post("login")
  @IsPublic()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(AuthGuard("housekeeper-local"))
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
