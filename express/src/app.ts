require("express-async-errors");
import exceptionsMiddleware from "@/src/middlewares/exceptions.middleware";
import unknownRoutesMiddleware from "@/src/middlewares/unknown-routes.middleware";
import apiRouter from "@/src/routes";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import paginationMiddleware from "./middlewares/pagination.middleware";
import sortingMiddleware from "./middlewares/sorting.middleware";
import { globalThrottler } from "./middlewares/throttler.middleware";
import { sessionsGuard } from "./guards/sessions.guard";
const port = 3000;
require("express-async-errors");

const app = express();

async function bootstrap() {
  // add .env variables to process.env
  dotenv.config();

  // extends dayjs with plugins
  dayjs.locale("fr");
  dayjs.extend(utc);
  dayjs.extend(customParseFormat);

  // disable `x-powered-by` header for security reasons
  app.disable("x-powered-by");

  // Trust the `X-Forwarded-For` header for cloudflare and other reverse proxies
  // to send the real IP address of the client by this header.
  app.set("trust proxy", true);

  // We parse the body of the request to be able to access it
  // @example: app.post('/', (req) => req.body.prop)
  app.use(express.json());

  // enable files upload
  app.use(fileUpload());

  app.use(sortingMiddleware);

  app.use(paginationMiddleware);

  // Block everything if the user is not authenticated and the route is not public
  // get the user from the token and add it to the request (req.account)
  app.use(sessionsGuard);

  // ----------------------------------------
  // Routes
  // ----------------------------------------
  app.use("/api", globalThrottler, apiRouter);

  app.use(unknownRoutesMiddleware);

  // ----------------------------------------
  // Errors handler
  // @important: Should be the last `app.use`
  // ----------------------------------------
  app.use(exceptionsMiddleware);

  app.listen(port, () => {
    console.log(`🚀  Server ready on port: ${port}`);
  });
}

bootstrap();

export { app };
