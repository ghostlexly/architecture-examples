import express from "express";
import { authenticate } from "../auth/auth.controller";
import housekeeperInsuranceController from "./housekeeper-insurance.controller";
const router = express.Router();

router.post("/certificate", housekeeperInsuranceController.storeCertificate);
router.get("/certificate", housekeeperInsuranceController.showCertificate);
router.delete(
  "/certificate",
  housekeeperInsuranceController.destroyCertificate
);

export default router;
