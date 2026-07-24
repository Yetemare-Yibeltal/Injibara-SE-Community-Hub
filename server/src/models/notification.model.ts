import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type NotificationType =
  | "mention"
  | "reaction"
  | "announcement"
  | "assignment";

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  type: NotificationType;
  sourceId: Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      required: [true, "Recipient ID is required"],
    },
    type: {
      type: String,
      enum: ["mention", "reaction", "announcement", "assignment"],
      required: [true, "Notification type is required"],
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      required: [true, "Source ID is required"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

notificationSchema.index({ recipientId: 1, read: 1 });

const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);

export default Notification;
