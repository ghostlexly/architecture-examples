import express from "express";
import bankAccountsController from "./bank-accounts.controller";

const router = express.Router();

router.get("/", bankAccountsController.findAll);

router.post("/", bankAccountsController.create);

router.patch("/:id", bankAccountsController.update);

export default router;
