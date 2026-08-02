import { Request, Response } from "express";
import * as notificationService from "../services/notification.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccess } from "../utils/apiResponse.util";
import { ApiError } from "../middlewares/errorHandler.middleware";

export const listNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { unreadOnly } = req.query as { unreadOnly?: string };
    const notifications = await notificationService.listNotifications(
      req.user.id,
      unreadOnly === "true",
    );

    return sendSuccess(res, 200, "Notifications retrieved", notifications);
  },
);

export const getUnreadCount = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const count = await notificationService.getUnreadCount(req.user.id);
    return sendSuccess(res, 200, "Unread count retrieved", { count });
  },
);

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user.id,
  );
  return sendSuccess(res, 200, "Notification marked as read", notification);
});

export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    await notificationService.markAllAsRead(req.user.id);
    return sendSuccess(res, 200, "All notifications marked as read");
  },
);
