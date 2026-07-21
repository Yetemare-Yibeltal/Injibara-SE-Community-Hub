import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config";
import { config } from "../config/env.config";

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const error = new ApiError(404, `Route not found: ${req.originalUrl}`);
  next(error);
}

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  logger.error(`${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);
  if (!(err instanceof ApiError) || !err.isOperational) {
    logger.error(err.stack || "No stack trace available");
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.isDevelopment && !(err instanceof ApiError)
      ? { stack: err.stack }
      : {}),
  });
}
