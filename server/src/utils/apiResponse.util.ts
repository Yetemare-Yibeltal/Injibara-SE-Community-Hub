import { Response } from "express";

interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
): Response {
  const body: SuccessResponse<T> = {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  };
  return res.status(statusCode).json(body);
}

