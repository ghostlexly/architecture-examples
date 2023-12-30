import { strictThrottler } from "@/src/middlewares/throttler.middleware";
import express from "express";
import commonAuthController from "./common/common-auth.controller";
import customerAuthController from "./customer/customer-auth.controller";
import housekeeperAuthController from "./housekeeper/housekeeper-auth.controller";

const router = express.Router();

router.post(
  "/housekeeper/login",
  [strictThrottler],
  housekeeperAuthController.login
);

router.post("/customer/login", [strictThrottler], customerAuthController.login);

router.get("/me", [], commonAuthController.getMe);

export default router;
