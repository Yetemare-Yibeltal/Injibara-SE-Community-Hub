import User, { IUserProfile } from "../models/user.model";
import Teacher, { ITeacherProfile } from "../models/teacher.model";
import { ApiError } from "../middlewares/errorHandler.middleware";

type Role = "student" | "teacher" | "admin";

export async function getMyProfile(userId: string, role: Role) {
  if (role === "student") {
    const student = await User.findById(userId);
    if (!student) throw new ApiError(404, "Account not found");
    return student;
  }

  if (role === "teacher") {
    const teacher = await Teacher.findById(userId);
    if (!teacher) throw new ApiError(404, "Account not found");
    return teacher;
  }

  throw new ApiError(400, "Admins do not have a profile");
}

export async function updateMyProfile(
  userId: string,
  role: Role,
  updates: Partial<IUserProfile | ITeacherProfile>,
) {
  if (role === "student") {
    const student = await User.findById(userId);
    if (!student) throw new ApiError(404, "Account not found");

    student.profile = { ...student.profile, ...updates };
    await student.save();
    return student.profile;
  }

  if (role === "teacher") {
    const teacher = await Teacher.findById(userId);
    if (!teacher) throw new ApiError(404, "Account not found");

    teacher.profile = { ...teacher.profile, ...updates };
    await teacher.save();
    return teacher.profile;
  }

  throw new ApiError(400, "Admins do not have a profile");
}
