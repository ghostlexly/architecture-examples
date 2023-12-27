import express from "express";
import housekeeperDocumentsController from "./documents.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import storeSchema from "./schemas/store.schema";

const router = express.Router();

router.post("/save", housekeeperDocumentsController.save);

router.post(
  "/:type",
  validateSchema(storeSchema),
  housekeeperDocumentsController.create
);

router.get(
  "/:type",
  validateSchema(storeSchema),
  housekeeperDocumentsController.findOne
);

router.delete(
  "/:type",
  validateSchema(storeSchema),
  housekeeperDocumentsController.remove
);

export default router;
