import { Socket } from "socket.io";
import { getIO } from "../config/socket.config";
import { verifyAccessToken, AccessTokenPayload } from "../utils/jwt.util";
import logger from "../config/logger.config";
import { registerMessageHandlers } from "./message.socket";
import { registerPresenceHandlers } from "./presence.socket";
import { registerTypingHandlers } from "./typing.socket";
import { registerNotificationHandlers } from "./notification.socket";

export interface AuthenticatedSocket extends Socket {
  user?: AccessTokenPayload;
}

export function initializeSocketHandlers(): void {
  const io = getIO();

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;

    if (!token) {
      return next(new Error("Authentication token is required"));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    if (!socket.user) {
      socket.disconnect(true);
      return;
    }

    logger.info(`Socket connected: ${socket.user.identifier} (${socket.id})`);

    registerMessageHandlers(io, socket);
    registerPresenceHandlers(io, socket);
    registerTypingHandlers(io, socket);
    registerNotificationHandlers(io, socket);

    socket.on("disconnect", () => {
      logger.info(
        `Socket disconnected: ${socket.user?.identifier} (${socket.id})`,
      );
    });
  });

  logger.info("Socket.IO handlers initialized");
}
