import express from "express";
import authController from "./auth.controller";
import { strictThrottler } from "@/src/middlewares/throttler.middleware";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import loginSchema from "./schemas/login.schema";
import registerSchema from "./schemas/register.schema";

const router = express.Router();

router.post(
  "/login",
  strictThrottler,
  validateSchema(loginSchema),
  authController.login
);

router.get("/me", authController.me);

router.post(
  "/register",
  strictThrottler,
  validateSchema(registerSchema),
  authController.register
);

export default router;
