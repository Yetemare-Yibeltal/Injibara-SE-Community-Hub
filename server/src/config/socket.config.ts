import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { config } from "./env.config";

let io: SocketIOServer | null = null;

export function initSocket(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.clientUrl,
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized. Call initSocket() first.",
    );
  }
  return io;
}

export default initSocket;
