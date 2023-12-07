import { Module } from "@nestjs/common";
import { HkInformationsController } from "./hk-informations.controller";
import { HousekeepersService } from "../housekeepers/housekeepers.service";

@Module({
  providers: [HousekeepersService],
  controllers: [HkInformationsController],
})
export class HkInformationsModule {}
