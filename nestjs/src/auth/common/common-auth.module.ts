import { Module } from "@nestjs/common";
import { CommonAuthController } from "./common-auth.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  providers: [JwtStrategy],
  controllers: [CommonAuthController],
})
export class CommonAuthModule {}
