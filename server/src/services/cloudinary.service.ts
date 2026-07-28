import { Readable } from "stream";
import cloudinary from "../config/cloudinary.config";
import { ApiError } from "../middlewares/errorHandler.middleware";

interface UploadResult {
  url: string;
  publicId: string;
}

function resolveResourceType(mimetype: string): "image" | "video" | "raw" {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/") || mimetype.startsWith("audio/"))
    return "video";
  return "raw";
}

export async function uploadBuffer(
  buffer: Buffer,
  mimetype: string,
  folder = "injibara-se-community",
): Promise<UploadResult> {
  const resourceType = resolveResourceType(mimetype);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(
            new ApiError(
              500,
              `File upload failed: ${error?.message || "Unknown error"}`,
            ),
          );
          return;
        }

        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function deleteFile(
  publicId: string,
  mimetype: string,
): Promise<void> {
  const resourceType = resolveResourceType(mimetype);

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to delete file: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
