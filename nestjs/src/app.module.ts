import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HousekeeperAuthModule } from "./auth/housekeeper/housekeeper-auth.module";
import { HkInformationsModule } from "./models/hk-informations/hk-informations.module";
import { HousekeepersModule } from "./models/housekeepers/housekeepers.module";
import { PrismaModule } from "./providers/database/prisma.module";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { JWTAuthGuard } from "./auth/common/guards/jwt.guard";
import { ZodValidationPipe } from "./lib/zod-validation.pipe";
import { CustomerAuthModule } from "./auth/customer/customer-auth.module";
import { CustomersModule } from "./models/customers/customers.module";
import { RolesGuard } from "./auth/common/guards/roles.guard";
import { CommonAuthModule } from "./auth/common/common-auth.module";
import { HkAvailabilitiesModule } from "./models/hk-availabilities/hk-availabilities.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    PrismaModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // milliseconds - 1 minute
        limit: 100,
      },
    ]),
    CommonAuthModule,
    CustomerAuthModule,
    CustomersModule,
    HousekeeperAuthModule,
    HousekeepersModule,
    HkInformationsModule,
    HkAvailabilitiesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JWTAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
