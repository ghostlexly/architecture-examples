import express from "express";
import housekeeperGeographicalAreaController from "./housekeeper-geographical-area.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import storeSchema from "./schemas/store.schema";

const router = express.Router();

router.get("/", housekeeperGeographicalAreaController.index);

router.post(
  "/",
  validateSchema(storeSchema),
  housekeeperGeographicalAreaController.store
);

export default router;
