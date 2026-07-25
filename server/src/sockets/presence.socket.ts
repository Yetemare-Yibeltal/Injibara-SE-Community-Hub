import { Server } from "socket.io";
import { AuthenticatedSocket } from "./index";

export function registerPresenceHandlers(
  io: Server,
  socket: AuthenticatedSocket,
): void {
  if (!socket.user) return;

  socket.broadcast.emit("presence:online", { userId: socket.user.id });

  socket.on("disconnect", () => {
    io.emit("presence:offline", { userId: socket.user?.id });
  });
}
