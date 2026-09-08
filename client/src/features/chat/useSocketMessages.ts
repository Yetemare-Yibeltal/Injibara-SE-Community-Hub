import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { getSocket } from "../../lib/socketClient";
import { setUserTyping } from "./chatSlice";
import type { MessageDTO } from "@shared/types";

export function useSocketMessages(chatId: string | null) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const joinedChatRef = useRef<string | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatId) return;

    if (joinedChatRef.current && joinedChatRef.current !== chatId) {
      socket.emit("chat:leave", { chatId: joinedChatRef.current });
    }

    socket.emit("chat:join", { chatId });
    joinedChatRef.current = chatId;

    function handleNewMessage(message: MessageDTO): void {
      if (message.chatId !== chatId) return;

      queryClient.setQueryData<MessageDTO[]>(["messages", chatId], (old) => {
        if (!old) return [message];
        return [message, ...old];
      });
    }

    function handleTypingStart(payload: {
      chatId: string;
      userId: string;
    }): void {
      if (payload.chatId !== chatId) return;
      dispatch(
        setUserTyping({ chatId, userId: payload.userId, isTyping: true }),
      );
    }

    function handleTypingStop(payload: {
      chatId: string;
      userId: string;
    }): void {
      if (payload.chatId !== chatId) return;
      dispatch(
        setUserTyping({ chatId, userId: payload.userId, isTyping: false }),
      );
    }

    socket.on("message:new", handleNewMessage);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [chatId, queryClient, dispatch]);

  function sendMessage(content: string): void {
    const socket = getSocket();
    if (!socket || !chatId) return;

    socket.emit("message:send", { chatId, content, type: "text" });
  }

  function notifyTyping(isTyping: boolean): void {
    const socket = getSocket();
    if (!socket || !chatId) return;

    socket.emit(isTyping ? "typing:start" : "typing:stop", { chatId });
  }

  return { sendMessage, notifyTyping };
}
