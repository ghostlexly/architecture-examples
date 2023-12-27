import express from "express";
import bankAccountsController from "./bank-accounts.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import storeSchema from "./schemas/store.schema";
import updateSchema from "./schemas/update.schema";

const router = express.Router();

router.get("/", bankAccountsController.findAll);

router.post("/", validateSchema(storeSchema), bankAccountsController.create);

router.patch(
  "/:id",
  validateSchema(updateSchema),
  bankAccountsController.update
);

export default router;
