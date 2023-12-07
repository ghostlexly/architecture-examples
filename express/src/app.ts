import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import express from "express";
import fileUpload from "express-fileupload";
const port = 3000;
require("dotenv").config();
require("express-async-errors");

import exceptionsMiddleware from "@/src/middlewares/exceptions.middleware";
import unknownRoutesMiddleware from "@/src/middlewares/unknown-routes.middleware";
import apiRouter from "@/src/routes";
import { JwtGuard } from "./guards/jwt.guard";
import { globalThrottler } from "./middlewares/throttler.middleware";

async function bootstrap() {
  // extends dayjs with plugins
  dayjs.extend(utc);

  // --------------------
  // We create a new express application instance
  // ---------------------
  const app = express();
  app.disable("x-powered-by");

  // ----------------------------------------
  // configure Expressjs to trust the X-Forwarded-For header
  // ----------------------------------------
  app.set("trust proxy", true);

  // ----------------------------------------
  // enable files upload
  // ----------------------------------------
  app.use(fileUpload());

  /**
   * We parse the body of the request to be able to access it
   * @example app.post('/', (req) => req.body.prop)
   */
  app.use(express.json());

  // ----------------------------------------
  // get user from authorization token
  // the user will be available in req.user
  // this guard block all routes except the ones in the whitelist
  // ----------------------------------------
  app.use(JwtGuard);

  // ----------------------------------------
  // Routes
  // ----------------------------------------
  app.use("/api", globalThrottler, apiRouter);

  app.use(unknownRoutesMiddleware);

  // ----------------------------------------
  // Errors handler
  // /!\ Should be the last `app.use`
  // ----------------------------------------
  app.use(exceptionsMiddleware);

  app.listen(port, () => {
    console.log(`🚀  Server ready on port: ${port}`);
  });
}

bootstrap();
