import express from "express";
import testsController from "@/src/api/tests/tests.controller";

const router = express.Router();

router.get("/", testsController.index);
// router.post("/", testsController.store);
// router.get("/:id", testsController.show);
// router.patch("/:id", testsController.update);

export default router;
