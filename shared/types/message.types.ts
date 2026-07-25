export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "code";
export type SenderRole = "student" | "teacher";

export interface ReactionDTO {
  userId: string;
  emoji: string;
}

export interface MessageDTO {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: SenderRole;
  content: string;
  type: MessageType;
  attachmentUrl?: string;
  replyTo?: string;
  reactions: ReactionDTO[];
  editedAt?: string;
  deletedForEveryone: boolean;
  pinnedAt?: string;
  readBy: string[];
  createdAt: string;
}
