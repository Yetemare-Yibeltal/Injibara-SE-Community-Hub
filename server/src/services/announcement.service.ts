import { FilterQuery } from "mongoose";
import Announcement, { IAnnouncement } from "../models/announcement.model";
import { ApiError } from "../middlewares/errorHandler.middleware";

interface AccessContext {
  userId: string;
  allowedBatches: string[] | "all";
}

export async function listAnnouncements(
  ctx: AccessContext,
  courseId?: string,
): Promise<IAnnouncement[]> {
  const filter: FilterQuery<IAnnouncement> = {};

  if (courseId) {
    filter.courseId = courseId;
  } else if (ctx.allowedBatches !== "all") {
    filter.$or = [
      { scope: "department" },
      { scope: "batch", batchScope: { $in: ctx.allowedBatches } },
    ];
  }

  return Announcement.find(filter).sort({ pinned: -1, createdAt: -1 });
}

export async function createAnnouncement(
  authorId: string,
  input: {
    scope: "batch" | "course" | "department";
    batchScope?: string;
    courseId?: string;
    title: string;
    content: string;
    pinned?: boolean;
  },
): Promise<IAnnouncement> {
  return Announcement.create({ ...input, authorId });
}

export async function deleteAnnouncement(
  announcementId: string,
): Promise<void> {
  const announcement = await Announcement.findByIdAndDelete(announcementId);

  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }
}