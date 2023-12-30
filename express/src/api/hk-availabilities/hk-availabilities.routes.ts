import { Router } from "express";
import availabilitiesController from "./hk-availabilities.controller";

const router = Router();

router.get("/", availabilitiesController.findAll);

router.post("/", [], availabilitiesController.create);

router.delete("/:id", [], availabilitiesController.remove);

export default router;
