import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.string().max(5000, "Message is too long").optional().default(""),
  type: z
    .enum(["text", "image", "video", "audio", "file", "code"])
    .default("text"),
  attachmentUrl: z.string().url("Invalid attachment URL").optional(),
  replyTo: z.string().optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

export const editMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content is required")
    .max(5000, "Message is too long"),
});

export type EditMessageInput = z.infer<typeof editMessageSchema>;

export const reactToMessageSchema = z.object({
  emoji: z.string().min(1, "Emoji is required").max(10, "Invalid emoji"),
});

export type ReactToMessageInput = z.infer<typeof reactToMessageSchema>;
