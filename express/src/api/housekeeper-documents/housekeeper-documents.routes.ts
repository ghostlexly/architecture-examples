import express from "express";
import housekeeperDocumentsController from "./housekeeper-documents.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import storeSchema from "./schemas/store.schema";

const router = express.Router();

router.post("/save", housekeeperDocumentsController.save);

router.post(
  "/:type",
  validateSchema(storeSchema),
  housekeeperDocumentsController.store
);

router.get(
  "/:type",
  validateSchema(storeSchema),
  housekeeperDocumentsController.show
);

router.delete(
  "/:type",
  validateSchema(storeSchema),
  housekeeperDocumentsController.destroy
);

export default router;
