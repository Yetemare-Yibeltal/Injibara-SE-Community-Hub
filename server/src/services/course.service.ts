import { FilterQuery } from "mongoose";
import Course, { ICourse } from "../models/course.model";
import { ApiError } from "../middlewares/errorHandler.middleware";

interface AccessContext {
  userId: string;
  allowedBatches: string[] | "all";
}

export async function listCourses(ctx: AccessContext): Promise<ICourse[]> {
  const filter: FilterQuery<ICourse> =
    ctx.allowedBatches === "all" ? {} : { batch: { $in: ctx.allowedBatches } };

  return Course.find(filter).sort({ createdAt: -1 });
}

export async function getCourseById(
  courseId: string,
  ctx: AccessContext,
): Promise<ICourse> {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (
    ctx.allowedBatches !== "all" &&
    !ctx.allowedBatches.includes(course.batch)
  ) {
    throw new ApiError(403, "You do not have access to this course");
  }

  return course;
}

export async function createCourse(input: {
  name: string;
  code: string;
  batch: string;
  semester: string;
  teacherIds?: string[];
}): Promise<ICourse> {
  return Course.create(input);
}

export async function updateCourse(
  courseId: string,
  updates: Partial<{
    name: string;
    code: string;
    batch: string;
    semester: string;
    teacherIds: string[];
  }>,
): Promise<ICourse> {
  const course = await Course.findByIdAndUpdate(courseId, updates, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  return course;
}

export async function deleteCourse(courseId: string): Promise<void> {
  const course = await Course.findByIdAndDelete(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }
}
