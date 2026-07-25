import { Router } from "express";
import * as moderationController from "../controllers/moderation.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.post("/users/:userId/block", moderationController.blockUser);
router.delete("/users/:userId/block", moderationController.unblockUser);
router.get("/users/blocked", moderationController.getBlockedUsers);

router.post("/reports", moderationController.createReport);

export default router;
