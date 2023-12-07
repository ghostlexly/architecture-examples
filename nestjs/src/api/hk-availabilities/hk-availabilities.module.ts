import { Module } from "@nestjs/common";
import { HkAvailabilitiesController } from "./hk-availabilities.controller";

@Module({
  imports: [],
  controllers: [HkAvailabilitiesController],
  providers: [],
})
export class HkAvailabilitiesModule {}
