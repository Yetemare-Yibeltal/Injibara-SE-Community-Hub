import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler.middleware";

type Role = "student" | "teacher" | "admin";

export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, "Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action"),
      );
    }

    next();
  };
}
