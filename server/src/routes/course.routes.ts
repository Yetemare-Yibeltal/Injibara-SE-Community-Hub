import { Router } from "express";
import * as courseController from "../controllers/course.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { attachBatchAccess } from "../middlewares/batchAccess.middleware";

const router = Router();

router.use(requireAuth, attachBatchAccess);

router.get("/", courseController.listCourses);
router.get("/:id", courseController.getCourse);
router.post("/", requireRole("admin"), courseController.createCourse);
router.patch("/:id", requireRole("admin"), courseController.updateCourse);
router.delete("/:id", requireRole("admin"), courseController.deleteCourse);

export default router;
