import { useEffect } from "react";
import { useAuth } from "../features/auth/useAuth";
import { connectSocket, disconnectSocket } from "../lib/socketClient";

export function useSocketConnection(): void {
  const { accessToken, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connectSocket(accessToken);
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, accessToken]);
}
