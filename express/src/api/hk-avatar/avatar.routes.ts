import express from "express";
import housekeeperAvatarController from "./avatar.controller";

const router = express.Router();

router.post("/", housekeeperAvatarController.create);
router.get("/", housekeeperAvatarController.findOne);
router.delete("/", housekeeperAvatarController.remove);

export default router;
