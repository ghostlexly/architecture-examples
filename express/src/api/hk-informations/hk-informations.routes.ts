import express from "express";
import housekeeperInformationsController from "./hk-informations.controller";

const router = express.Router();

router.post("/", housekeeperInformationsController.create);

router.get("/", housekeeperInformationsController.findOne);

router.patch("/:id", housekeeperInformationsController.update);

router.patch(
  "/:id/interventions",
  housekeeperInformationsController.updateInterventions
);

router.patch(
  "/:id/professional-informations",
  housekeeperInformationsController.updateProfessionalInfos
);

export default router;
