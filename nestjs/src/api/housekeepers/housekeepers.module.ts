import { Module } from "@nestjs/common";
import { HousekeepersService } from "./housekeepers.service";
import { HousekeepersController } from "./housekeepers.controller";

@Module({
  providers: [HousekeepersService],
  controllers: [HousekeepersController],
  exports: [HousekeepersService],
})
export class HousekeepersModule {}
