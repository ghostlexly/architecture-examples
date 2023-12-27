import { Router } from "express";
import availabilitiesController from "./hk-availabilities.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import createSchema from "./schemas/create.schema";
import removeSchema from "./schemas/remove.schema";

const router = Router();

router.get("/", availabilitiesController.findAll);

router.post(
  "/",
  [validateSchema(createSchema)],
  availabilitiesController.create
);

router.delete(
  "/:id",
  [validateSchema(removeSchema)],
  availabilitiesController.remove
);

export default router;
