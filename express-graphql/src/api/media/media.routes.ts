import express from "express";
import mediaController from "./media.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import mediaShowSchema from "./schemas/media-show.schema";

const router = express.Router();

router.get("/:id", validateSchema(mediaShowSchema), mediaController.show);

export default router;
