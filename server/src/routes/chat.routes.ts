import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { attachBatchAccess } from "../middlewares/batchAccess.middleware";

const router = Router();

router.use(requireAuth, attachBatchAccess);

router.get("/", chatController.listChats);
router.get("/:id", chatController.getChat);
router.post("/", chatController.createChat);
router.patch("/:id/archive", chatController.archiveChat);
router.patch("/:id/mute", chatController.toggleMuteChat);
router.patch("/:id/rename", chatController.renameGroup);
router.post("/:id/members", chatController.addMembers);
router.delete("/:id/members/:userId", chatController.removeMember);
router.post("/:id/leave", chatController.leaveGroup);

export default router;
