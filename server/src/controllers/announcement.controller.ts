import { Request, Response } from "express";
import { createAnnouncementSchema } from "@shared/validation/announcement.schema";
import * as announcementService from "../services/announcement.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccess } from "../utils/apiResponse.util";
import { ApiError } from "../middlewares/errorHandler.middleware";

export const listAnnouncements = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || !req.allowedBatches) {
      throw new ApiError(401, "Not authenticated");
    }

    const { courseId } = req.query as { courseId?: string };

    const announcements = await announcementService.listAnnouncements(
      { userId: req.user.id, allowedBatches: req.allowedBatches },
      courseId,
    );

    return sendSuccess(res, 200, "Announcements retrieved", announcements);
  },
);

export const createAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const parsed = createAnnouncementSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(
        400,
        parsed.error.issues[0]?.message || "Invalid input",
      );
    }

    const announcement = await announcementService.createAnnouncement(
      req.user.id,
      parsed.data,
    );
    return sendSuccess(res, 201, "Announcement created", announcement);
  },
);

export const deleteAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    await announcementService.deleteAnnouncement(req.params.id);
    return sendSuccess(res, 200, "Announcement deleted");
  },
);
