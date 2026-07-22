import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Student ID or Teacher ID is required").trim(),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const setPasswordSchema = z
  .object({
    identifier: z
      .string()
      .min(1, "Student ID or Teacher ID is required")
      .trim(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SetPasswordInput = z.infer<typeof setPasswordSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required").optional(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
