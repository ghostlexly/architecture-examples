import express from "express";
import mediaController from "./media.controller";

const router = express.Router();

router.get("/:id", mediaController.show);

export default router;
