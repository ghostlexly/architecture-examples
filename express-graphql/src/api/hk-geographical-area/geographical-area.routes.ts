import express from "express";
import housekeeperGeographicalAreaController from "./geographical-area.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import storeSchema from "./schemas/store.schema";

const router = express.Router();

router.get("/", housekeeperGeographicalAreaController.findAll);

router.post(
  "/",
  validateSchema(storeSchema),
  housekeeperGeographicalAreaController.create
);

export default router;
