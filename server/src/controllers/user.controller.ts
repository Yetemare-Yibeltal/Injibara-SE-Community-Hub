import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccess } from "../utils/apiResponse.util";
import { ApiError } from "../middlewares/errorHandler.middleware";

export const getMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const account = await userService.getMyProfile(req.user.id, req.user.role);
    return sendSuccess(res, 200, "Profile retrieved", account);
  },
);

export const updateMyProfile = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated");
    }

    const allowedFields = [
      "bio",
      "github",
      "linkedin",
      "portfolio",
      "phone",
      "photoUrl",
    ];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (field in req.body) {
        updates[field] = req.body[field];
      }
    }

    const profile = await userService.updateMyProfile(
      req.user.id,
      req.user.role,
      updates,
    );
    return sendSuccess(res, 200, "Profile updated", profile);
  },
);
