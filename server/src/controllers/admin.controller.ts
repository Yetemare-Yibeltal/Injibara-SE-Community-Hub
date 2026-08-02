import { Request, Response } from "express";
import multer from "multer";
import * as rosterUploadService from "../services/rosterUpload.service";
import * as batchPromotionService from "../services/batchPromotion.service";
import * as adminService from "../services/admin.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccess } from "../utils/apiResponse.util";
import { ApiError } from "../middlewares/errorHandler.middleware";

export const uploadCsvMiddleware = multer({
  storage: multer.memoryStorage(),
}).single("file");

export const uploadRoster = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    if (!req.file) {
      throw new ApiError(400, "No CSV file was uploaded");
    }

    const { batch } = req.body as { batch?: string };
    if (!batch) {
      throw new ApiError(400, "A default batch is required for this upload");
    }

    const csvContent = req.file.buffer.toString("utf-8");
    const result = await rosterUploadService.uploadRoster(csvContent, batch);

    return sendSuccess(res, 200, "Roster processed", result);
  },
);

export const promoteBatch = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { batch } = req.params;
    const result = await batchPromotionService.promoteBatch(batch, req.user.id);

    return sendSuccess(res, 200, "Batch promoted", result);
  },
);

export const createTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { teacherId, email, fullName } = req.body as {
      teacherId?: string;
      email?: string;
      fullName?: { first: string; middle: string; last: string };
    };

    if (!teacherId || !email || !fullName) {
      throw new ApiError(400, "teacherId, email, and fullName are required");
    }

    const teacher = await adminService.createTeacher(
      { teacherId, email, fullName },
      req.user.id,
    );
    return sendSuccess(res, 201, "Teacher created", teacher);
  },
);

export const approveTeacher = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const teacher = await adminService.approveTeacher(
      req.params.id,
      req.user.id,
    );
    return sendSuccess(res, 200, "Teacher approved", teacher);
  },
);

export const assignCourse = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { courseId, batch, section } = req.body as {
      courseId?: string;
      batch?: string;
      section?: string;
    };

    if (!courseId || !batch) {
      throw new ApiError(400, "courseId and batch are required");
    }

    const teacher = await adminService.assignCourseToTeacher(
      req.params.id,
      courseId,
      batch,
      section,
      req.user.id,
    );

    return sendSuccess(res, 200, "Course assigned", teacher);
  },
);

export const removeCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const { courseId, batch } = req.body as {
      courseId?: string;
      batch?: string;
    };

    if (!courseId || !batch) {
      throw new ApiError(400, "courseId and batch are required");
    }

    const teacher = await adminService.removeCourseFromTeacher(
      req.params.id,
      courseId,
      batch,
    );
    return sendSuccess(res, 200, "Course removed", teacher);
  },
);

export const listTeachers = asyncHandler(
  async (_req: Request, res: Response) => {
    const teachers = await adminService.listTeachers();
    return sendSuccess(res, 200, "Teachers retrieved", teachers);
  },
);

export const listAuditLogs = asyncHandler(
  async (_req: Request, res: Response) => {
    const logs = await adminService.listAuditLogs();
    return sendSuccess(res, 200, "Audit logs retrieved", logs);
  },
);
