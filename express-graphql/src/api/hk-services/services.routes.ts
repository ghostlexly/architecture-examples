import express from "express";
import hkServicesController from "./services.controller";

const router = express.Router();

router.get("/", hkServicesController.findAll);

export default router;
