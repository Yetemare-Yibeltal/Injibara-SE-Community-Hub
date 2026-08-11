import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  adminId: string;
  passwordHash: string;
  fullName: {
    first: string;
    middle: string;
    last: string;
  };
  email: string;
  role: "admin";
  status: "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    adminId: {
      type: String,
      required: [true, "Admin ID is required"],
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
      enum: ["admin"],
      default: "admin",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

adminSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
