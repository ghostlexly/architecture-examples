import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { HousekeepersModule } from "src/models/housekeepers/housekeepers.module";
import { HousekeeperAuthController } from "./housekeeper-auth.controller";
import { HousekeeperAuthService } from "./housekeeper-auth.service";
import { HousekeeperOAuthController } from "./housekeeper-oauth.controller";
import { LocalStrategy } from "./strategies/local.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [
    PassportModule,
    HousekeepersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [HousekeeperAuthService, LocalStrategy, GoogleStrategy],
  controllers: [HousekeeperAuthController, HousekeeperOAuthController],
})
export class HousekeeperAuthModule {}
