import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ChatType = "batch" | "course" | "department" | "private" | "custom";

export interface IChat extends Document {
  type: ChatType;
  name: string;
  batchScope?: string;
  courseId?: Types.ObjectId;
  memberIds: Types.ObjectId[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    type: {
      type: String,
      enum: ["batch", "course", "department", "private", "custom"],
      required: [true, "Chat type is required"],
    },
    name: {
      type: String,
      required: [true, "Chat name is required"],
      trim: true,
    },
    batchScope: {
      type: String,
      trim: true,
      default: null,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    memberIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

chatSchema.index({ batchScope: 1 });
chatSchema.index({ memberIds: 1 });
chatSchema.index({ type: 1 });
chatSchema.index({ courseId: 1 });

const Chat: Model<IChat> = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
