import express from "express";
import { authenticate } from "../auth/auth.controller";
import housekeeperAvatarController from "./housekeeper-avatar.controller";

const router = express.Router();

router.post("/", housekeeperAvatarController.store);
router.get("/", housekeeperAvatarController.show);
router.delete("/", housekeeperAvatarController.destroy);

export default router;
