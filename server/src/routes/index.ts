import { Router } from "express";
import authRoutes from "./auth.routes";
import chatRoutes from "./chat.routes";
import messageRoutes from "./message.routes";
import moderationRoutes from "./moderation.routes";
import fileRoutes from "./file.routes";
import courseRoutes from "./course.routes";
import announcementRoutes from "./announcement.routes";
import notificationRoutes from "./notification.routes";
import adminRoutes from "./admin.routes";

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
router.use("/files", fileRoutes);
router.use("/courses", courseRoutes);
router.use("/announcements", announcementRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);

export default router;
