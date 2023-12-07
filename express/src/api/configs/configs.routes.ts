import express from "express";
import configsController from "./configs.controller";

const router = express.Router();

router.get("/version", configsController.version);

export default router;
