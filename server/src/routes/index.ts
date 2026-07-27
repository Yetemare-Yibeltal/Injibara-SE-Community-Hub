import { Router } from "express";
import authRoutes from "./auth.routes";
import chatRoutes from "./chat.routes";
import messageRoutes from "./message.routes";
import moderationRoutes from "./moderation.routes";

const router = Router();

// Health check route - confirms the API is alive and reachable
router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Injibara SE Community API is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/chats", chatRoutes);
router.use("/messages", messageRoutes);
router.use("/", moderationRoutes);

// Additional feature routes will be mounted here as they are built
// in later phases, for example:
// router.use('/users', userRoutes);

export default router;
