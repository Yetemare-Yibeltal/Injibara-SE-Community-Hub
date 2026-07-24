import { Request, Response, NextFunction } from "express";
import { ApiError } from "./errorHandler.middleware";

export function attachBatchAccess(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    return next(new ApiError(401, "Not authenticated"));
  }

  if (req.user.role === "admin") {
    req.allowedBatches = "all";
    return next();
  }

  if (req.user.role === "student") {
    if (!req.user.batch) {
      return next(new ApiError(403, "No batch assigned to this account"));
    }
    req.allowedBatches = [req.user.batch];
    return next();
  }

  if (req.user.role === "teacher") {
    const batches = req.user.assignedCourses?.map((c) => c.batch) || [];
    const uniqueBatches = Array.from(new Set(batches));

    if (uniqueBatches.length === 0) {
      return next(new ApiError(403, "No courses assigned to this account yet"));
    }

    req.allowedBatches = uniqueBatches;
    return next();
  }

  return next(new ApiError(403, "Unrecognized role"));
}
