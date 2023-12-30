import authRoutes from "@/src/api/auth/auth.routes";
import configsRoutes from "@/src/api/configs/configs.routes";
import housekeeperGeographicalAreaRoutes from "@/src/api/hk-geographical-area/geographical-area.routes";
import housekeeperInformationsRoutes from "@/src/api/hk-informations/hk-informations.routes";
import mediaRoutes from "@/src/api/media/media.routes";
import express from "express";
import bankAccountsRoutes from "./api/hk-bank-accounts/bank-accounts.routes";
import countriesRoutes from "./api/countries/countries.routes";
import hkServicesRoutes from "./api/hk-services/services.routes";
import housekeeperAvatarRoutes from "./api/hk-avatar/avatar.routes";
import housekeeperDocumentsRoutes from "./api/hk-documents/documents.routes";
import housekeeperInsuranceRoutes from "./api/hk-insurance/insurance.routes";
import housekeepersRoutes from "./api/housekeepers/housekeepers.routes";
import hkAvailabilitiesRoutes from "./api/hk-availabilities/hk-availabilities.routes";
import customersRoutes from "./api/customers/customers.routes";
import searchRoutes from "./api/search/search.routes";

const router = express.Router();

// Authentification
router.use("/auth", authRoutes);

// Controllers
router.use("/configs", configsRoutes);
router.use("/media", mediaRoutes);
router.use("/housekeepers", housekeepersRoutes);

router.use("/hk-informations", housekeeperInformationsRoutes);

router.use("/hk-geographical-area", housekeeperGeographicalAreaRoutes);

router.use("/hk-bank-accounts", bankAccountsRoutes);

router.use("/hk-documents", housekeeperDocumentsRoutes);

router.use("/hk-avatar", housekeeperAvatarRoutes);

router.use("/hk-insurance", housekeeperInsuranceRoutes);

router.use("/hk-services", [], hkServicesRoutes);

router.use("/hk-availabilities", hkAvailabilitiesRoutes);

router.use("/countries", countriesRoutes);

router.use("/search", searchRoutes);

router.use("/customers", customersRoutes);

export default router;
