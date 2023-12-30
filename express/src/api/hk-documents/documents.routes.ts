import express from "express";
import housekeeperDocumentsController from "./documents.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import storeSchema from "./schemas/store.schema";

const router = express.Router();

router.post("/save", housekeeperDocumentsController.save);

router.post("/:type", housekeeperDocumentsController.create);

router.get("/:type", housekeeperDocumentsController.findOne);

router.delete("/:type", housekeeperDocumentsController.remove);

export default router;
