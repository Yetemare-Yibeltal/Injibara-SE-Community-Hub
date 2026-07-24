import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type AnnouncementScope = "batch" | "course" | "department";

export interface IAnnouncement extends Document {
  authorId: Types.ObjectId;
  scope: AnnouncementScope;
  batchScope?: string;
  courseId?: Types.ObjectId;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      required: [true, "Author ID is required"],
    },
    scope: {
      type: String,
      enum: ["batch", "course", "department"],
      required: [true, "Scope is required"],
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
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

announcementSchema.index({ batchScope: 1 });
announcementSchema.index({ courseId: 1 });
announcementSchema.index({ scope: 1 });

const Announcement: Model<IAnnouncement> = mongoose.model<IAnnouncement>(
  "Announcement",
  announcementSchema,
);

export default Announcement;
