import { Types } from "mongoose";
import Message, { IMessage } from "../models/message.model";
import { getChatById } from "./chat.service";
import { ApiError } from "../middlewares/errorHandler.middleware";

interface AccessContext {
  userId: string;
  allowedBatches: string[] | "all";
}

interface PaginationOptions {
  limit?: number;
  before?: string;
}

export async function getMessagesForChat(
  chatId: string,
  ctx: AccessContext,
  options: PaginationOptions = {},
): Promise<IMessage[]> {
  await getChatById(chatId, ctx);

  const limit = Math.min(options.limit || 50, 100);
  const filter: Record<string, unknown> = { chatId };

  if (options.before) {
    filter._id = { $lt: new Types.ObjectId(options.before) };
  }

  return Message.find(filter).sort({ createdAt: -1 }).limit(limit);
}

export async function editMessage(
  messageId: string,
  userId: string,
  newContent: string,
): Promise<IMessage> {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.senderId.toString() !== userId) {
    throw new ApiError(403, "You can only edit your own messages");
  }

  if (message.deletedForEveryone) {
    throw new ApiError(400, "Cannot edit a deleted message");
  }

  message.content = newContent;
  message.editedAt = new Date();
  await message.save();

  return message;
}

export async function deleteMessage(
  messageId: string,
  userId: string,
): Promise<IMessage> {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  if (message.senderId.toString() !== userId) {
    throw new ApiError(403, "You can only delete your own messages");
  }

  message.deletedForEveryone = true;
  message.content = "";
  message.attachmentUrl = undefined;
  await message.save();

  return message;
}

export async function reactToMessage(
  messageId: string,
  userId: string,
  emoji: string,
): Promise<IMessage> {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  const existingIndex = message.reactions.findIndex(
    (r) => r.userId.toString() === userId,
  );

  if (existingIndex >= 0) {
    if (message.reactions[existingIndex].emoji === emoji) {
      message.reactions.splice(existingIndex, 1);
    } else {
      message.reactions[existingIndex].emoji = emoji;
    }
  } else {
    message.reactions.push({ userId: new Types.ObjectId(userId), emoji });
  }

  await message.save();
  return message;
}

export async function togglePinMessage(messageId: string): Promise<IMessage> {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new ApiError(404, "Message not found");
  }

  message.pinnedAt = message.pinnedAt ? undefined : new Date();
  await message.save();

  return message;
}

export async function forwardMessage(
  messageId: string,
  userId: string,
  userRole: "student" | "teacher",
  targetChatId: string,
  ctx: AccessContext,
): Promise<IMessage> {
  const original = await Message.findById(messageId);

  if (!original) {
    throw new ApiError(404, "Original message not found");
  }

  if (original.deletedForEveryone) {
    throw new ApiError(400, "Cannot forward a deleted message");
  }

  await getChatById(targetChatId, ctx);

  const forwarded = await Message.create({
    chatId: targetChatId,
    senderId: userId,
    senderRole: userRole,
    content: original.content,
    type: original.type,
    attachmentUrl: original.attachmentUrl,
    forwardedFrom: original._id,
  });

  return forwarded;
}
