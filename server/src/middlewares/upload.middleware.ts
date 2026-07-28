import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { ALLOWED_FILE_TYPES } from "@shared/validation/file.schema";
import { config } from "../config/env.config";

const storage = multer.memoryStorage();

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
): void {
  const allowed = ALLOWED_FILE_TYPES as readonly string[];

  if (allowed.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error(`File type "${file.mimetype}" is not allowed`));
  }
}

export const uploadSingleFile = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileUploadSizeMb * 1024 * 1024,
  },
}).single("file");
