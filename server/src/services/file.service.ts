import { FilterQuery } from "mongoose";
import File, { IFile } from "../models/file.model";
import * as cloudinaryService from "./cloudinary.service";
import { ApiError } from "../middlewares/errorHandler.middleware";

interface AccessContext {
  userId: string;
  allowedBatches: string[] | "all";
}

interface UploadFileInput {
  buffer: Buffer;
  mimetype: string;
  originalName: string;
  sizeBytes: number;
  uploaderId: string;
  uploaderRole: "student" | "teacher";
  chatId?: string;
  courseId?: string;
  batchScope?: string;
}

export async function uploadFile(input: UploadFileInput): Promise<IFile> {
  const { url, publicId } = await cloudinaryService.uploadBuffer(
    input.buffer,
    input.mimetype,
  );

  const file = await File.create({
    uploaderId: input.uploaderId,
    uploaderRole: input.uploaderRole,
    chatId: input.chatId || null,
    courseId: input.courseId || null,
    batchScope: input.batchScope || null,
    fileName: input.originalName,
    fileType: input.mimetype,
    fileSizeBytes: input.sizeBytes,
    cloudinaryUrl: url,
    cloudinaryPublicId: publicId,
  });

  return file;
}

export async function listFiles(
  ctx: AccessContext,
  filters: { courseId?: string; chatId?: string } = {},
): Promise<IFile[]> {
  const filter: FilterQuery<IFile> = {};

  if (filters.courseId) filter.courseId = filters.courseId;
  if (filters.chatId) filter.chatId = filters.chatId;

  if (ctx.allowedBatches !== "all" && !filters.chatId) {
    filter.$or = [
      { batchScope: { $in: ctx.allowedBatches } },
      { uploaderId: ctx.userId },
    ];
  }

  return File.find(filter).sort({ createdAt: -1 });
}

export async function deleteFile(
  fileId: string,
  userId: string,
): Promise<void> {
  const file = await File.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (file.uploaderId.toString() !== userId) {
    throw new ApiError(403, "You can only delete your own files");
  }

  await cloudinaryService.deleteFile(file.cloudinaryPublicId, file.fileType);
  await file.deleteOne();
}
