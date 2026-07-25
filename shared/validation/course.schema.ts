import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string().min(1, "Course name is required").trim(),
  code: z.string().min(1, "Course code is required").trim(),
  batch: z.string().min(1, "Batch is required").trim(),
  semester: z.string().min(1, "Semester is required").trim(),
  teacherIds: z.array(z.string()).optional().default([]),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export const updateCourseSchema = createCourseSchema.partial();

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
