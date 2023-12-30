import express from "express";
import housekeeperGeographicalAreaController from "./geographical-area.controller";

const router = express.Router();

router.get("/", housekeeperGeographicalAreaController.findAll);

router.post("/", housekeeperGeographicalAreaController.create);

export default router;
