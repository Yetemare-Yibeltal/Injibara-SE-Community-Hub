import { Request, Response } from "express";
import * as moderationService from "../services/moderation.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccess } from "../utils/apiResponse.util";
import { ApiError } from "../middlewares/errorHandler.middleware";

export const blockUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  await moderationService.blockUser(
    req.user.id,
    req.user.role,
    req.params.userId,
  );
  return sendSuccess(res, 200, "User blocked");
});

export const unblockUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  await moderationService.unblockUser(
    req.user.id,
    req.user.role,
    req.params.userId,
  );
  return sendSuccess(res, 200, "User unblocked");
});

export const getBlockedUsers = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const blockedUserIds = await moderationService.getBlockedUserIds(
      req.user.id,
      req.user.role,
    );
    return sendSuccess(res, 200, "Blocked users retrieved", blockedUserIds);
  },
);

export const createReport = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const { targetType, targetId, reason } = req.body as {
      targetType?: "message" | "user";
      targetId?: string;
      reason?: string;
    };

    if (!targetType || !targetId || !reason) {
      throw new ApiError(400, "targetType, targetId, and reason are required");
    }

    await moderationService.createReport(
      req.user.id,
      targetType,
      targetId,
      reason,
    );
    return sendSuccess(res, 201, "Report submitted");
  },
);
