import { io, type Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
    });
  }

  return socket;
}

export function connectSocket(accessToken: string): Socket {
  const currentSocket = getSocket();

  currentSocket.auth = {
    token: accessToken,
  };

  if (!currentSocket.connected) {
    currentSocket.connect();
  }

  return currentSocket;
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
