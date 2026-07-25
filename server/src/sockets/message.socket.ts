import { Server } from "socket.io";
import { AuthenticatedSocket } from "./index";
import Message from "../models/message.model";
import logger from "../config/logger.config";

interface JoinChatPayload {
  chatId: string;
}

interface SendMessagePayload {
  chatId: string;
  content: string;
  type?: "text" | "image" | "video" | "audio" | "file" | "code";
  attachmentUrl?: string;
  replyTo?: string;
}

interface ReadMessagesPayload {
  chatId: string;
  messageIds: string[];
}

export function registerMessageHandlers(
  io: Server,
  socket: AuthenticatedSocket,
): void {
  if (!socket.user) return;

  socket.on("chat:join", ({ chatId }: JoinChatPayload) => {
    socket.join(chatId);
  });

  socket.on("chat:leave", ({ chatId }: JoinChatPayload) => {
    socket.leave(chatId);
  });

  socket.on("message:send", async (payload: SendMessagePayload) => {
    if (!socket.user) return;

    try {
      const message = await Message.create({
        chatId: payload.chatId,
        senderId: socket.user.id,
        senderRole: socket.user.role,
        content: payload.content,
        type: payload.type || "text",
        attachmentUrl: payload.attachmentUrl,
        replyTo: payload.replyTo,
      });

      io.to(payload.chatId).emit("message:new", message);
    } catch (error) {
      logger.error(
        `Failed to save message: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      socket.emit("message:error", { message: "Failed to send message" });
    }
  });

  socket.on("message:read", async (payload: ReadMessagesPayload) => {
    if (!socket.user) return;

    try {
      await Message.updateMany(
        { _id: { $in: payload.messageIds }, chatId: payload.chatId },
        { $addToSet: { readBy: socket.user.id } },
      );

      io.to(payload.chatId).emit("message:read", {
        chatId: payload.chatId,
        messageIds: payload.messageIds,
        userId: socket.user.id,
      });
    } catch (error) {
      logger.error(
        `Failed to mark messages as read: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      socket.emit("message:error", { message: "Failed to update read status" });
    }
  });
}
