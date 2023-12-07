import authRoutes from "@/src/api/auth/auth.routes";
import configsRoutes from "@/src/api/configs/configs.routes";
import housekeeperGeographicalAreaRoutes from "@/src/api/housekeeper-geographical-area/housekeeper-geographical-area.routes";
import housekeeperInformationsRoutes from "@/src/api/housekeeper-informations/housekeeper-informations.routes";
import mediaRoutes from "@/src/api/media/media.routes";
import testRoutes from "@/src/api/tests/tests.routes";
import express from "express";
import bankAccountsRoutes from "./api/bank-accounts/bank-accounts.routes";
import countriesRoutes from "./api/countries/countries.routes";
import hkServicesRoutes from "./api/hk-services/hk-services.routes";
import housekeeperAvatarRoutes from "./api/housekeeper-avatar/housekeeper-avatar.routes";
import housekeeperDocumentsRoutes from "./api/housekeeper-documents/housekeeper-documents.routes";
import housekeeperInsuranceRoutes from "./api/housekeeper-insurance/housekeeper-insurance.routes";

const router = express.Router();

// Authentification
router.use("/auth", authRoutes);

// Controllers
router.use("/tests", testRoutes);
router.use("/configs", configsRoutes);
router.use("/media", mediaRoutes);
router.use("/housekeeper-informations", housekeeperInformationsRoutes);
router.use("/housekeeper-geographical-area", housekeeperGeographicalAreaRoutes);
router.use("/bank-accounts", bankAccountsRoutes);
router.use("/housekeeper-documents", housekeeperDocumentsRoutes);
router.use("/housekeeper-avatar", housekeeperAvatarRoutes);
router.use("/housekeeper-insurance", housekeeperInsuranceRoutes);
router.use("/housekeeper-services", hkServicesRoutes);
router.use("/countries", countriesRoutes);

export default router;
