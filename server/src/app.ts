import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { config } from "./config/env.config";
import logger from "./config/logger.config";
import routes from "./routes/index";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/errorHandler.middleware";

const app: Application = express();

// Security headers
app.use(helmet());

// CORS - only allow requests from our frontend
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);

// Body & cookie parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Request logging - routed through Winston instead of raw console output
const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};
app.use(
  morgan(config.isDevelopment ? "dev" : "combined", { stream: morganStream }),
);

// Rate limiting - protects auth and API routes from abuse
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMinutes * 60 * 1000,
  max: config.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api", apiLimiter);

// Routes
app.use("/api", routes);

// 404 handler - must come after all valid routes
app.use(notFoundHandler);

// Global error handler - must be the last middleware
app.use(errorHandler);

export default app;
