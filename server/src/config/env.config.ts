import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  CLIENT_URL: z.string().min(1, "CLIENT_URL is required"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),

  EMAIL_SERVICE: z.string().default("resend"),
  EMAIL_API_KEY: z.string().min(1, "EMAIL_API_KEY is required"),
  EMAIL_FROM: z.string().email("EMAIL_FROM must be a valid email address"),

  MAX_FILE_UPLOAD_SIZE_MB: z.string().default("25"),

  RATE_LIMIT_WINDOW_MINUTES: z.string().default("15"),
  RATE_LIMIT_MAX_REQUESTS: z.string().default("100"),
});

type EnvSchema = z.infer<typeof envSchema>;

function loadEnv(): EnvSchema {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid or missing environment variables:");
    for (const issue of parsed.error.issues) {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  return parsed.data;
}

const env = loadEnv();

export const config = {
  nodeEnv: env.NODE_ENV,
  port: parseInt(env.PORT, 10),
  clientUrl: env.CLIENT_URL,
  isProduction: env.NODE_ENV === "production",
  isDevelopment: env.NODE_ENV === "development",

  mongodbUri: env.MONGODB_URI,

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },

  email: {
    service: env.EMAIL_SERVICE,
    apiKey: env.EMAIL_API_KEY,
    from: env.EMAIL_FROM,
  },

  maxFileUploadSizeMb: parseInt(env.MAX_FILE_UPLOAD_SIZE_MB, 10),

  rateLimit: {
    windowMinutes: parseInt(env.RATE_LIMIT_WINDOW_MINUTES, 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
} as const;

export default config;
