import express from "express";
import housekeeperInsuranceController from "./insurance.controller";
const router = express.Router();

router.post("/certificate", housekeeperInsuranceController.createCertificate);
router.get("/certificate", housekeeperInsuranceController.findOneCertificate);
router.delete("/certificate", housekeeperInsuranceController.removeCertificate);

export default router;
