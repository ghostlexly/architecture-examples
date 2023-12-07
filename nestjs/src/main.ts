import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix("api");
  app.disable("x-powered-by");
  app.set("trust proxy", true);

  // dayjs configuration
  dayjs.locale("fr");
  dayjs.extend(utc);
  dayjs.extend(customParseFormat);

  await app.listen(3000);
}
bootstrap();
