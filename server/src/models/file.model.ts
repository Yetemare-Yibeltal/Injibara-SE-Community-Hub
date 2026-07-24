import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type UploaderRole = "student" | "teacher";

export interface IFile extends Document {
  uploaderId: Types.ObjectId;
  uploaderRole: UploaderRole;
  chatId?: Types.ObjectId;
  courseId?: Types.ObjectId;
  batchScope?: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  createdAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    uploaderId: {
      type: Schema.Types.ObjectId,
      required: [true, "Uploader ID is required"],
    },
    uploaderRole: {
      type: String,
      enum: ["student", "teacher"],
      required: [true, "Uploader role is required"],
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    batchScope: {
      type: String,
      trim: true,
      default: null,
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
    },
    fileSizeBytes: {
      type: Number,
      required: [true, "File size is required"],
    },
    cloudinaryUrl: {
      type: String,
      required: [true, "Cloudinary URL is required"],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

fileSchema.index({ batchScope: 1 });
fileSchema.index({ courseId: 1 });
fileSchema.index({ chatId: 1 });

const File: Model<IFile> = mongoose.model<IFile>("File", fileSchema);

export default File;
