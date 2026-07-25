import { z } from "zod";

export const uploadFileMetaSchema = z.object({
  chatId: z.string().optional(),
  courseId: z.string().optional(),
  batchScope: z.string().optional(),
});

export type UploadFileMetaInput = z.infer<typeof uploadFileMetaSchema>;

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/zip",
  "application/x-rar-compressed",
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "text/plain",
  "text/x-python",
  "application/javascript",
  "text/x-java-source",
  "text/x-c",
] as const;

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB default, matches server config
