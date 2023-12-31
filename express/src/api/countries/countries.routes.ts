import express from "express";
import countriesController from "./countries.controller";

const router = express.Router();

router.get("/", countriesController.findAll);

export default router;
