import { Router } from "express";
import housekeepersController from "./housekeepers.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import registerSchema from "./schemas/register.schema";

const router = Router();

router.post(
  "/register",
  validateSchema(registerSchema),
  housekeepersController.register
);

export default router;
