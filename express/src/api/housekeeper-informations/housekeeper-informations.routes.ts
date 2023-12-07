import express from "express";
import housekeeperInformationsController from "./housekeeper-informations.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import updateSchema from "./schemas/update.schema";
import hkInterventionsSchema from "./schemas/hk-interventions.schema";
import storeProInfosSchema from "./schemas/store-pro-infos.schema";
import storeSchema from "./schemas/store.schema";

const router = express.Router();

router.post(
  "/",
  validateSchema(storeSchema),
  housekeeperInformationsController.store
);

router.get("/", housekeeperInformationsController.index);

router.patch(
  "/:id",
  validateSchema(updateSchema),
  housekeeperInformationsController.update
);

router.patch(
  "/:id/interventions",
  validateSchema(hkInterventionsSchema),
  housekeeperInformationsController.interventions
);

router.patch(
  "/:id/professional-informations",
  validateSchema(storeProInfosSchema),
  housekeeperInformationsController.patchProfessionalInfos
);

export default router;
