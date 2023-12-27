import { strictThrottler } from "@/src/middlewares/throttler.middleware";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import express from "express";
import commonAuthController from "./common/common-auth.controller";
import housekeeperAuthController from "./housekeeper/housekeeper-auth.controller";
import loginSchema from "./housekeeper/schemas/login.schema";
import customerAuthController from "./customer/customer-auth.controller";

const router = express.Router();

router.post(
  "/housekeeper/login",
  [strictThrottler, validateSchema(loginSchema)],
  housekeeperAuthController.login
);

router.post(
  "/customer/login",
  [strictThrottler, validateSchema(loginSchema)],
  customerAuthController.login
);

router.get("/me", [], commonAuthController.getMe);

export default router;
