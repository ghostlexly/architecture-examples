import { Router } from "express";
import searchController from "./search.controller";

const router = Router();

router.post("/", searchController.housekeepers);

export default router;
