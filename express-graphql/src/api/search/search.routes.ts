import { Router } from "express";
import searchController from "./search.controller";
import { validateSchema } from "@/src/middlewares/validate.middleware";
import housekeepersSchema from "./schemas/housekeepers.schema";

const router = Router();

router.post(
  "/",
  [validateSchema(housekeepersSchema)],
  searchController.housekeepers
);

export default router;
