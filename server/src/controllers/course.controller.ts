import { Request, Response } from "express";
import {
  createCourseSchema,
  updateCourseSchema,
} from "@shared/validation/course.schema";
import * as courseService from "../services/course.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccess } from "../utils/apiResponse.util";
import { ApiError } from "../middlewares/errorHandler.middleware";

function getAccessContext(req: Request) {
  if (!req.user || !req.allowedBatches) {
    throw new ApiError(401, "Not authenticated");
  }
  return { userId: req.user.id, allowedBatches: req.allowedBatches };
}

export const listCourses = asyncHandler(async (req: Request, res: Response) => {
  const ctx = getAccessContext(req);
  const courses = await courseService.listCourses(ctx);
  return sendSuccess(res, 200, "Courses retrieved", courses);
});

export const getCourse = asyncHandler(async (req: Request, res: Response) => {
  const ctx = getAccessContext(req);
  const course = await courseService.getCourseById(req.params.id, ctx);
  return sendSuccess(res, 200, "Course retrieved", course);
});

export const createCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = createCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues[0]?.message || "Invalid input",
      );
    }

    const course = await courseService.createCourse(parsed.data);
    return sendSuccess(res, 201, "Course created", course);
  },
);

export const updateCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const parsed = updateCourseSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues[0]?.message || "Invalid input",
      );
    }

    const course = await courseService.updateCourse(req.params.id, parsed.data);
    return sendSuccess(res, 200, "Course updated", course);
  },
);

export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    await courseService.deleteCourse(req.params.id);
    return sendSuccess(res, 200, "Course deleted");
  },
);
