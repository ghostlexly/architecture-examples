import express from "express";
import bankAccountsController from "./bank-accounts.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import storeSchema from "./schemas/store.schema";
import updateSchema from "./schemas/update.schema";

const router = express.Router();

router.get("/", bankAccountsController.index);

router.post("/", validateSchema(storeSchema), bankAccountsController.store);

router.patch(
  "/:id",
  validateSchema(updateSchema),
  bankAccountsController.update
);

export default router;
