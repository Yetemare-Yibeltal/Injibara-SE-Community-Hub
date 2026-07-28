import { Request, Response } from "express";
import { uploadFileMetaSchema } from "@shared/validation/file.schema";
import * as fileService from "../services/file.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccess } from "../utils/apiResponse.util";
import { ApiError } from "../middlewares/errorHandler.middleware";

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  if (!req.file) {
    throw new ApiError(400, "No file was uploaded");
  }

  const parsed = uploadFileMetaSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Invalid input");
  }

  const file = await fileService.uploadFile({
    buffer: req.file.buffer,
    mimetype: req.file.mimetype,
    originalName: req.file.originalname,
    sizeBytes: req.file.size,
    uploaderId: req.user.id,
    uploaderRole: req.user.role as "student" | "teacher",
    chatId: parsed.data.chatId,
    courseId: parsed.data.courseId,
    batchScope: parsed.data.batchScope,
  });

  return sendSuccess(res, 201, "File uploaded", file);
});

export const listFiles = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || !req.allowedBatches) {
    throw new ApiError(401, "Not authenticated");
  }

  const { courseId, chatId } = req.query as {
    courseId?: string;
    chatId?: string;
  };

  const files = await fileService.listFiles(
    { userId: req.user.id, allowedBatches: req.allowedBatches },
    { courseId, chatId },
  );

  return sendSuccess(res, 200, "Files retrieved", files);
});

export const deleteFile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  await fileService.deleteFile(req.params.id, req.user.id);
  return sendSuccess(res, 200, "File deleted");
});
