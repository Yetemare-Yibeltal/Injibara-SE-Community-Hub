import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type ReportTargetType = "message" | "user";
export type ReportStatus = "pending" | "reviewed" | "dismissed";

export interface IReport extends Document {
  reporterId: Types.ObjectId;
  targetType: ReportTargetType;
  targetId: Types.ObjectId;
  reason: string;
  status: ReportStatus;
  reviewedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      required: [true, "Reporter ID is required"],
    },
    targetType: {
      type: String,
      enum: ["message", "user"],
      required: [true, "Target type is required"],
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: [true, "Target ID is required"],
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed"],
      default: "pending",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true },
);

reportSchema.index({ status: 1 });
reportSchema.index({ targetType: 1, targetId: 1 });

const Report: Model<IReport> = mongoose.model<IReport>("Report", reportSchema);

export default Report;
