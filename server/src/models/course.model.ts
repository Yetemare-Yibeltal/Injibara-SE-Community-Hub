import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICourse extends Document {
  name: string;
  code: string;
  batch: string;
  teacherIds: Types.ObjectId[];
  semester: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
      uppercase: true,
    },
    batch: {
      type: String,
      required: [true, "Batch is required"],
      trim: true,
    },
    teacherIds: {
      type: [Schema.Types.ObjectId],
      ref: "Teacher",
      default: [],
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

courseSchema.index({ batch: 1 });
courseSchema.index({ teacherIds: 1 });
courseSchema.index({ code: 1, batch: 1 }, { unique: true });

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);

export default Course;
