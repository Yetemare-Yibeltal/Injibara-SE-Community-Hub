import { Router } from "express";
import * as announcementController from "../controllers/announcement.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { attachBatchAccess } from "../middlewares/batchAccess.middleware";

const router = Router();

router.use(requireAuth, attachBatchAccess);

router.get("/", announcementController.listAnnouncements);
router.post(
  "/",
  requireRole("teacher", "admin"),
  announcementController.createAnnouncement,
);
router.delete(
  "/:id",
  requireRole("teacher", "admin"),
  announcementController.deleteAnnouncement,
);

export default router;
