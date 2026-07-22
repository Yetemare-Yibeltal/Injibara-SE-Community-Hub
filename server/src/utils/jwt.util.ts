import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/env.config";

export interface AccessTokenPayload {
  id: string;
  identifier: string;
  role: "student" | "teacher" | "admin";
  batch?: string;
  assignedCourses?: { courseId: string; batch: string; section?: string }[];
}

export interface RefreshTokenPayload {
  id: string;
  role: "student" | "teacher" | "admin";
}

export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  } as SignOptions);
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, config.jwt.accessSecret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as RefreshTokenPayload;
}
