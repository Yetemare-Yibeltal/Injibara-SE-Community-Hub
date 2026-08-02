import { z } from "zod";

export const createAnnouncementSchema = z.object({
  scope: z.enum(["batch", "course", "department"]),
  batchScope: z.string().optional(),
  courseId: z.string().optional(),
  title: z.string().min(1, "Title is required").trim(),
  content: z.string().min(1, "Content is required"),
  pinned: z.boolean().optional().default(false),
});

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
