import { Server } from "socket.io";
import { AuthenticatedSocket } from "./index";
import User from "../models/user.model";
import Teacher from "../models/teacher.model";
import logger from "../config/logger.config";

async function updateLastSeen(userId: string, role: string): Promise<void> {
  try {
    if (role === "student") {
      await User.findByIdAndUpdate(userId, { lastSeenAt: new Date() });
    } else if (role === "teacher") {
      await Teacher.findByIdAndUpdate(userId, { lastSeenAt: new Date() });
    }
  } catch (error) {
    logger.error(
      `Failed to update lastSeenAt: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

export function registerPresenceHandlers(
  io: Server,
  socket: AuthenticatedSocket,
): void {
  if (!socket.user) return;

  socket.broadcast.emit("presence:online", { userId: socket.user.id });

  socket.on("disconnect", async () => {
    if (!socket.user) return;

    const lastSeenAt = new Date();
    await updateLastSeen(socket.user.id, socket.user.role);

    io.emit("presence:offline", {
      userId: socket.user.id,
      lastSeenAt: lastSeenAt.toISOString(),
    });
  });
}
