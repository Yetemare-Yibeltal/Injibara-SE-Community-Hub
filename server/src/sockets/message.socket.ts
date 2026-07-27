import { Server } from "socket.io";
import { AuthenticatedSocket } from "./index";
import Message, { IMessage } from "../models/message.model";
import User from "../models/user.model";
import Teacher from "../models/teacher.model";
import Notification from "../models/notification.model";
import { emitNotificationToUser } from "./notification.socket";
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

const MENTION_REGEX = /@([A-Za-z0-9_-]+)/g;

async function processMentions(
  io: Server,
  message: IMessage,
  senderId: string,
): Promise<void> {
  const matches = message.content.matchAll(MENTION_REGEX);
  const identifiers = Array.from(new Set(Array.from(matches, (m) => m[1])));

  if (identifiers.length === 0) return;

  for (const identifier of identifiers) {
    const student = await User.findOne({ studentId: identifier });
    const teacher = !student
      ? await Teacher.findOne({ teacherId: identifier })
      : null;
    const account = student || teacher;

    if (!account || account._id.toString() === senderId) continue;

    const notification = await Notification.create({
      recipientId: account._id,
      type: "mention",
      sourceId: message._id,
      read: false,
    });

    emitNotificationToUser(
      io,
      account._id.toString(),
      "notification:new",
      notification,
    );
  }
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

      await processMentions(io, message, socket.user.id);
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
