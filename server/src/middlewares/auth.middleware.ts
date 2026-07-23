import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util";
import { ApiError } from "./errorHandler.middleware";

export function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "No access token provided"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired access token"));
  }
}
