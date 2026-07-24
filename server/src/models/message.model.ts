import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file"
  | "code";
export type SenderRole = "student" | "teacher";

export interface IReaction {
  userId: Types.ObjectId;
  emoji: string;
}

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderRole: SenderRole;
  content: string;
  type: MessageType;
  attachmentUrl?: string;
  replyTo?: Types.ObjectId;
  reactions: IReaction[];
  editedAt?: Date;
  deletedForEveryone: boolean;
  pinnedAt?: Date;
  readBy: Types.ObjectId[];
  createdAt: Date;
}

const reactionSchema = new Schema<IReaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    emoji: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Chat ID is required"],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: [true, "Sender ID is required"],
    },
    senderRole: {
      type: String,
      enum: ["student", "teacher"],
      required: [true, "Sender role is required"],
    },
    content: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "audio", "file", "code"],
      default: "text",
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    reactions: {
      type: [reactionSchema],
      default: [],
    },
    editedAt: {
      type: Date,
      default: null,
    },
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },
    pinnedAt: {
      type: Date,
      default: null,
    },
    readBy: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

messageSchema.index({ chatId: 1, createdAt: -1 });

const Message: Model<IMessage> = mongoose.model<IMessage>(
  "Message",
  messageSchema,
);

export default Message;
