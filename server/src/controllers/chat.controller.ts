import { Request, Response } from "express";
import * as chatService from "../services/chat.service";
import { asyncHandler } from "../utils/asyncHandler.util";
import { sendSuccess } from "../utils/apiResponse.util";
import { ApiError } from "../middlewares/errorHandler.middleware";

function getAccessContext(req: Request) {
  if (!req.user || !req.allowedBatches) {
    throw new ApiError(401, "Not authenticated");
  }
  return { userId: req.user.id, allowedBatches: req.allowedBatches };
}

export const listChats = asyncHandler(async (req: Request, res: Response) => {
  const ctx = getAccessContext(req);
  const chats = await chatService.listChatsForUser(ctx);
  return sendSuccess(res, 200, "Chats retrieved", chats);
});

export const getChat = asyncHandler(async (req: Request, res: Response) => {
  const ctx = getAccessContext(req);
  const chat = await chatService.getChatById(req.params.id, ctx);
  return sendSuccess(res, 200, "Chat retrieved", chat);
});

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Not authenticated");
  }

  const { name, memberIds } = req.body as {
    name?: string;
    memberIds?: string[];
  };

  if (
    !name ||
    !memberIds ||
    !Array.isArray(memberIds) ||
    memberIds.length === 0
  ) {
    throw new ApiError(
      400,
      "A chat name and at least one member ID are required",
    );
  }

  const chat = await chatService.createCustomChat(req.user.id, name, memberIds);
  return sendSuccess(res, 201, "Chat created", chat);
});

export const archiveChat = asyncHandler(async (req: Request, res: Response) => {
  const ctx = getAccessContext(req);
  const chat = await chatService.archiveChat(req.params.id, ctx);
  return sendSuccess(res, 200, "Chat archived", chat);
});

export const toggleMuteChat = asyncHandler(
  async (req: Request, res: Response) => {
    const ctx = getAccessContext(req);
    const chat = await chatService.toggleMuteChat(req.params.id, ctx);
    return sendSuccess(res, 200, "Chat mute status updated", chat);
  },
);
