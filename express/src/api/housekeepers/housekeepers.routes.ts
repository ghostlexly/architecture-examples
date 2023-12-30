import { Router } from "express";
import housekeepersController from "./housekeepers.controller";

const router = Router();

router.post("/register", housekeepersController.register);

export default router;
