import express from "express";
import hkServicesController from "./hk-services.controller";

const router = express.Router();

router.get("/", hkServicesController.index);

export default router;
