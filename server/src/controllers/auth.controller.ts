import { Request, Response } from "express";
import { loginSchema, setPasswordSchema } from "@shared/validation/auth.schema";
import * as authService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccess } from "../utils/apiResponse.util";
import { ApiError } from "../middlewares/errorHandler.middleware";
import { config } from "../config/env.config";

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Invalid input");
  }

  const { identifier, password } = parsed.data;
  const result = await authService.login(identifier, password);

  res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  });

  return sendSuccess(res, 200, "Login successful", {
    accessToken: result.accessToken,
    user: result.user,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!refreshToken) {
    throw new ApiError(401, "No refresh token provided");
  }

  const accessToken = await authService.refreshAccessToken(refreshToken);

  return sendSuccess(res, 200, "Token refreshed", { accessToken });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
  });

  return sendSuccess(res, 200, "Logged out successfully");
});

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current password and new password are required");
    }

    if (newPassword.length < 8) {
      throw new ApiError(400, "New password must be at least 8 characters");
    }

    const authUser = req.user;
    if (!authUser) {
      throw new ApiError(401, "Not authenticated");
    }

    await authService.changePassword(
      authUser.id,
      authUser.role as "student" | "teacher",
      currentPassword,
      newPassword,
    );

    return sendSuccess(res, 200, "Password changed successfully");
  },
);

export const setPassword = asyncHandler(async (req: Request, res: Response) => {
  const parsed = setPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || "Invalid input");
  }

  const { identifier, newPassword } = parsed.data;
  await authService.activateAccount(identifier, newPassword);

  return sendSuccess(
    res,
    200,
    "Password set successfully. You can now log in.",
  );
});
