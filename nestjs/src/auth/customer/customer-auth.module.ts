import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { CustomerAuthController } from "./customer-auth.controller";
import { CustomerAuthService } from "./customer-auth.service";
import { CustomerOAuthController } from "./customer-oauth.controller";
import { LocalStrategy } from "./strategies/local.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [CustomerAuthService, LocalStrategy, GoogleStrategy],
  controllers: [CustomerAuthController, CustomerOAuthController],
})
export class CustomerAuthModule {}
