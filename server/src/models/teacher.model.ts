import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAssignedCourse {
  courseId: Types.ObjectId;
  batch: string;
  section?: string;
}

export interface ITeacherProfile {
  photoUrl?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  phone?: string;
}

export interface ITeacher extends Document {
  teacherId: string;
  passwordHash: string;
  fullName: {
    first: string;
    middle: string;
    last: string;
  };
  email: string;
  role: "teacher";
  status: "pending_approval" | "active" | "suspended";
  assignedCourses: IAssignedCourse[];
  profile: ITeacherProfile;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const assignedCourseSchema = new Schema<IAssignedCourse>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const teacherProfileSchema = new Schema<ITeacherProfile>(
  {
    photoUrl: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    skills: { type: [String], default: [] },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { _id: false },
);

const teacherSchema = new Schema<ITeacher>(
  {
    teacherId: {
      type: String,
      required: [true, "Teacher ID is required"],
      unique: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    fullName: {
      first: { type: String, required: true, trim: true },
      middle: { type: String, required: true, trim: true },
      last: { type: String, required: true, trim: true },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["teacher"],
      default: "teacher",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending_approval", "active", "suspended"],
      default: "pending_approval",
    },
    assignedCourses: {
      type: [assignedCourseSchema],
      default: [],
    },
    profile: {
      type: teacherProfileSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

teacherSchema.index({ "assignedCourses.courseId": 1 });

teacherSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

teacherSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const Teacher: Model<ITeacher> = mongoose.model<ITeacher>(
  "Teacher",
  teacherSchema,
);

export default Teacher;
