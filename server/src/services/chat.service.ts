import { FilterQuery, Types } from "mongoose";
import Chat, { IChat } from "../models/chat.model";
import Message from "../models/message.model";
import { ApiError } from "../middlewares/errorHandler.middleware";

interface AccessContext {
  userId: string;
  allowedBatches: string[] | "all";
}

export interface ChatWithUnreadCount {
  chat: IChat;
  unreadCount: number;
}

function buildAccessFilter(ctx: AccessContext): FilterQuery<IChat> {
  const scopedFilter: FilterQuery<IChat> =
    ctx.allowedBatches === "all"
      ? { type: { $in: ["batch", "course", "department"] } }
      : {
          type: { $in: ["batch", "course", "department"] },
          batchScope: { $in: ctx.allowedBatches },
        };

  const memberFilter: FilterQuery<IChat> = {
    type: { $in: ["private", "custom"] },
    memberIds: new Types.ObjectId(ctx.userId),
  };

  return { $or: [scopedFilter, memberFilter] };
}

export async function listChatsForUser(
  ctx: AccessContext,
): Promise<ChatWithUnreadCount[]> {
  const filter = buildAccessFilter(ctx);
  const chats = await Chat.find({ ...filter, isArchived: false }).sort({
    updatedAt: -1,
  });

  const withUnreadCounts = await Promise.all(
    chats.map(async (chat) => {
      const unreadCount = await Message.countDocuments({
        chatId: chat._id,
        senderId: { $ne: ctx.userId },
        readBy: { $ne: new Types.ObjectId(ctx.userId) },
        deletedForEveryone: false,
      });

      return { chat, unreadCount };
    }),
  );

  return withUnreadCounts;
}

export async function getChatById(
  chatId: string,
  ctx: AccessContext,
): Promise<IChat> {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new ApiError(404, "Chat not found");
  }

  const hasAccess = await userCanAccessChat(chat, ctx);
  if (!hasAccess) {
    throw new ApiError(403, "You do not have access to this chat");
  }

  return chat;
}

async function userCanAccessChat(
  chat: IChat,
  ctx: AccessContext,
): Promise<boolean> {
  if (chat.type === "private" || chat.type === "custom") {
    return chat.memberIds.some((id) => id.toString() === ctx.userId);
  }

  if (ctx.allowedBatches === "all") {
    return true;
  }

  return !!chat.batchScope && ctx.allowedBatches.includes(chat.batchScope);
}

export async function createCustomChat(
  creatorId: string,
  name: string,
  memberIds: string[],
): Promise<IChat> {
  const uniqueMembers = Array.from(new Set([creatorId, ...memberIds]));

  const chat = await Chat.create({
    type: uniqueMembers.length === 2 ? "private" : "custom",
    name,
    memberIds: uniqueMembers,
  });

  return chat;
}

export async function archiveChat(
  chatId: string,
  ctx: AccessContext,
): Promise<IChat> {
  const chat = await getChatById(chatId, ctx);
  chat.isArchived = true;
  await chat.save();
  return chat;
}

export async function toggleMuteChat(
  chatId: string,
  ctx: AccessContext,
): Promise<IChat> {
  const chat = await getChatById(chatId, ctx);
  const userObjectId = new Types.ObjectId(ctx.userId);
  const isMuted = chat.mutedBy.some((id) => id.toString() === ctx.userId);

  if (isMuted) {
    chat.mutedBy = chat.mutedBy.filter((id) => id.toString() !== ctx.userId);
  } else {
    chat.mutedBy.push(userObjectId);
  }

  await chat.save();
  return chat;
}

export async function addMembersToGroup(
  chatId: string,
  ctx: AccessContext,
  newMemberIds: string[],
): Promise<IChat> {
  const chat = await getChatById(chatId, ctx);

  if (chat.type !== "custom" && chat.type !== "private") {
    throw new ApiError(400, "Can only add members to custom or private chats");
  }

  const existingIds = new Set(chat.memberIds.map((id) => id.toString()));
  const toAdd = newMemberIds.filter((id) => !existingIds.has(id));

  chat.memberIds.push(...toAdd.map((id) => new Types.ObjectId(id)));

  if (chat.type === "private" && chat.memberIds.length > 2) {
    chat.type = "custom";
  }

  await chat.save();
  return chat;
}

export async function removeMemberFromGroup(
  chatId: string,
  ctx: AccessContext,
  targetUserId: string,
): Promise<IChat> {
  const chat = await getChatById(chatId, ctx);

  if (chat.type !== "custom" && chat.type !== "private") {
    throw new ApiError(
      400,
      "Can only remove members from custom or private chats",
    );
  }

  chat.memberIds = chat.memberIds.filter(
    (id) => id.toString() !== targetUserId,
  );
  await chat.save();
  return chat;
}

export async function leaveGroup(
  chatId: string,
  ctx: AccessContext,
): Promise<void> {
  const chat = await getChatById(chatId, ctx);

  if (chat.type !== "custom" && chat.type !== "private") {
    throw new ApiError(400, "Can only leave custom or private chats");
  }

  chat.memberIds = chat.memberIds.filter((id) => id.toString() !== ctx.userId);
  await chat.save();
}
