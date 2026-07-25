import { Request, Response } from 'express';
import { editMessageSchema, reactToMessageSchema } from '@shared/validation/message.schema';
import * as messageService from '../services/message.service';
import { asyncHandler } from '../utils/asyncHandler.util';
import { sendSuccess } from '../utils/apiResponse.util';
import { ApiError } from '../middlewares/errorHandler.middleware';

function getAccessContext(req: Request) {
  if (!req.user || !req.allowedBatches) {
    throw new ApiError(401, 'Not authenticated');
  }
  return { userId: req.user.id, allowedBatches: req.allowedBatches };
}

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const ctx = getAccessContext(req);
  const { chatId } = req.params;
  const { limit, before } = req.query as { limit?: string; before?: string };

  const messages = await messageService.getMessagesForChat(chatId, ctx, {
    limit: limit ? parseInt(limit, 10) : undefined,
    before,
  });

  return sendSuccess(res, 200, 'Messages retrieved', messages);
});

export const editMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const parsed = editMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');
  }

  const message = await messageService.editMessage(
    req.params.id,
    req.user.id,
    parsed.data.content
  );

  return sendSuccess(res, 200, 'Message updated', message);
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const message = await messageService.deleteMessage(req.params.id, req.user.id);
  return sendSuccess(res, 200, 'Message deleted', message);
});

export const reactToMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const parsed = reactToMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message || 'Invalid input');
  }

  const message = await messageService.reactToMessage(
    req.params.id,
    req.user.id,
    parsed.data.emoji
  );

  return sendSuccess(res, 200, 'Reaction updated', message);
});

export const togglePinMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await messageService.togglePinMessage(req.params.id);
  return sendSuccess(res, 200, 'Pin status updated', message);
});