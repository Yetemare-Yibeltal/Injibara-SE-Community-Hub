import User, { IUser } from "../models/user.model";
import Teacher, { ITeacher } from "../models/teacher.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  AccessTokenPayload,
} from "../utils/jwt.util";
import { ApiError } from "../middlewares/errorHandler.middleware";

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    identifier: string;
    role: "student" | "teacher";
    fullName: { first: string; middle: string; last: string };
    batch?: string;
    assignedCourses?: { courseId: string; batch: string; section?: string }[];
    status: string;
  };
}

function buildAccessTokenPayload(
  account: IUser | ITeacher,
  role: "student" | "teacher",
): AccessTokenPayload {
  if (role === "student") {
    const student = account as IUser;
    return {
      id: student._id.toString(),
      identifier: student.studentId,
      role: "student",
      batch: student.batch,
    };
  }

  const teacher = account as ITeacher;
  return {
    id: teacher._id.toString(),
    identifier: teacher.teacherId,
    role: "teacher",
    assignedCourses: teacher.assignedCourses.map((c) => ({
      courseId: c.courseId.toString(),
      batch: c.batch,
      section: c.section,
    })),
  };
}

export async function login(
  identifier: string,
  password: string,
): Promise<LoginResult> {
  const student = await User.findOne({ studentId: identifier });
  const teacher = !student
    ? await Teacher.findOne({ teacherId: identifier })
    : null;

  const account = student || teacher;
  const role: "student" | "teacher" = student ? "student" : "teacher";

  if (!account) {
    throw new ApiError(401, "Invalid ID or password");
  }

  const isPasswordValid = await account.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid ID or password");
  }

  if (account.status === "pending") {
    throw new ApiError(
      403,
      "Account not yet activated. Please contact your administrator.",
    );
  }

  if (account.status === "suspended") {
    throw new ApiError(
      403,
      "This account has been suspended. Please contact your administrator.",
    );
  }

  if (role === "teacher" && account.status === "pending_approval") {
    throw new ApiError(403, "Your account is awaiting admin approval.");
  }

  const payload = buildAccessTokenPayload(account, role);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: payload.id, role });

  const result: LoginResult = {
    accessToken,
    refreshToken,
    user: {
      id: payload.id,
      identifier: payload.identifier,
      role,
      fullName: account.fullName,
      status: account.status,
      ...(role === "student" ? { batch: (account as IUser).batch } : {}),
      ...(role === "teacher"
        ? { assignedCourses: payload.assignedCourses }
        : {}),
    },
  };

  return result;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<string> {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const account =
    decoded.role === "student"
      ? await User.findById(decoded.id)
      : await Teacher.findById(decoded.id);

  if (!account) {
    throw new ApiError(401, "Account no longer exists");
  }

  const payload = buildAccessTokenPayload(
    account,
    decoded.role as "student" | "teacher",
  );
  return generateAccessToken(payload);
}

export async function changePassword(
  userId: string,
  role: "student" | "teacher",
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const account =
    role === "student"
      ? await User.findById(userId)
      : await Teacher.findById(userId);

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  const isCurrentValid = await account.comparePassword(currentPassword);
  if (!isCurrentValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  account.passwordHash = newPassword;
  await account.save();
}
