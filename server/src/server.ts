import { createServer } from "http";
import app from "./app";
import { config } from "./config/env.config";
import { connectDB, disconnectDB } from "./config/db.config";
import { initSocket } from "./config/socket.config";
import { initializeSocketHandlers } from "./sockets/index";
import logger from "./config/logger.config";

const httpServer = createServer(app);

async function startServer(): Promise<void> {
  try {
    await connectDB();

    initSocket(httpServer);
    initializeSocketHandlers();

    httpServer.listen(config.port, () => {
      logger.info(
        `🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`,
      );
      logger.info(
        `   Health check: http://localhost:${config.port}/api/health`,
      );
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to start server: ${error.message}`);
    }
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`${signal} received. Shutting down gracefully...`);

  httpServer.close(async () => {
    logger.info("HTTP server closed");
    await disconnectDB();
    process.exit(0);
  });

  // Force shutdown if it takes too long
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason: Error) => {
  logger.error(`Unhandled Rejection: ${reason.message}`);
  logger.error(reason.stack || "No stack trace");
});

process.on("uncaughtException", (error: Error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.error(error.stack || "No stack trace");
  process.exit(1);
});

startServer();
