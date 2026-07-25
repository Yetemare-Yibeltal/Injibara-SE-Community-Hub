import { Server } from "socket.io";
import { AuthenticatedSocket } from "./index";

export function registerNotificationHandlers(
  _io: Server,
  socket: AuthenticatedSocket,
): void {
  if (!socket.user) return;

  socket.join(`user:${socket.user.id}`);
}

export function emitNotificationToUser(
  io: Server,
  userId: string,
  event: string,
  payload: unknown,
): void {
  io.to(`user:${userId}`).emit(event, payload);
}
