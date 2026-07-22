import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserProfile {
  photoUrl?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  email?: string;
  phone?: string;
}

export interface IUser extends Document {
  studentId: string;
  passwordHash: string;
  fullName: {
    first: string;
    middle: string;
    last: string;
  };
  role: "student";
  batch: string;
  enrollmentType: "direct" | "transfer";
  joinedAt: Date;
  status: "pending" | "active" | "suspended" | "alumni";
  profile: IUserProfile;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    photoUrl: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    skills: { type: [String], default: [] },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
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
    role: {
      type: String,
      enum: ["student"],
      default: "student",
      required: true,
    },
    batch: {
      type: String,
      required: [true, "Batch is required"],
      trim: true,
    },
    enrollmentType: {
      type: String,
      enum: ["direct", "transfer"],
      default: "direct",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "active", "suspended", "alumni"],
      default: "pending",
    },
    profile: {
      type: userProfileSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

userSchema.index({ studentId: 1 }, { unique: true });
userSchema.index({ batch: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
