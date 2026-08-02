import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.post(
  "/roster/upload",
  adminController.uploadCsvMiddleware,
  adminController.uploadRoster,
);
router.post("/batches/:batch/promote", adminController.promoteBatch);

router.get("/teachers", adminController.listTeachers);
router.post("/teachers", adminController.createTeacher);
router.patch("/teachers/:id/approve", adminController.approveTeacher);
router.post("/teachers/:id/courses", adminController.assignCourse);
router.delete("/teachers/:id/courses", adminController.removeCourse);

router.get("/audit-logs", adminController.listAuditLogs);

export default router;
