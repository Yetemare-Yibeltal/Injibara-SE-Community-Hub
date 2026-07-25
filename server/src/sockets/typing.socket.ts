import { Server } from "socket.io";
import { AuthenticatedSocket } from "./index";

interface TypingPayload {
  chatId: string;
}

export function registerTypingHandlers(
  _io: Server,
  socket: AuthenticatedSocket,
): void {
  if (!socket.user) return;

  socket.on("typing:start", ({ chatId }: TypingPayload) => {
    socket.to(chatId).emit("typing:start", {
      chatId,
      userId: socket.user?.id,
    });
  });

  socket.on("typing:stop", ({ chatId }: TypingPayload) => {
    socket.to(chatId).emit("typing:stop", {
      chatId,
      userId: socket.user?.id,
    });
  });
}
