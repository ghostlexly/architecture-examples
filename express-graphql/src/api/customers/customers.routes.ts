import { Router } from "express";
import customersController from "./customers.controller";

const router = Router();

router.post("/register", customersController.create);

export default router;
