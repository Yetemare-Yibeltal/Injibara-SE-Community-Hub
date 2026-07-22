import winston from "winston";
import path from "path";
import { config } from "./env.config";

const logsDir = path.join(__dirname, "..", "logs");

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
      : `${timestamp} [${level.toUpperCase()}]: ${message}`;
  }),
);

const logger = winston.createLogger({
  level: config.isProduction ? "info" : "debug",
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  exitOnError: false,
});

if (!config.isProduction) {
  logger.add(
    new winston.transports.Console({
      format: logFormat,
    }),
  );
}

export default logger;
