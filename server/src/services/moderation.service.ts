import { Types } from "mongoose";
import User from "../models/user.model";
import Teacher from "../models/teacher.model";
import Report from "../models/report.model";
import { ApiError } from "../middlewares/errorHandler.middleware";

type Role = "student" | "teacher" | "admin";

export async function blockUser(
  actorId: string,
  actorRole: Role,
  targetUserId: string,
): Promise<void> {
  if (actorId === targetUserId) {
    throw new ApiError(400, "You cannot block yourself");
  }

  const targetObjectId = new Types.ObjectId(targetUserId);

  if (actorRole === "student") {
    const account = await User.findById(actorId);
    if (!account) throw new ApiError(404, "Account not found");

    const alreadyBlocked = account.blockedUserIds.some(
      (id) => id.toString() === targetUserId,
    );
    if (!alreadyBlocked) {
      account.blockedUserIds.push(targetObjectId);
      await account.save();
    }
    return;
  }

  if (actorRole === "teacher") {
    const account = await Teacher.findById(actorId);
    if (!account) throw new ApiError(404, "Account not found");

    const alreadyBlocked = account.blockedUserIds.some(
      (id) => id.toString() === targetUserId,
    );
    if (!alreadyBlocked) {
      account.blockedUserIds.push(targetObjectId);
      await account.save();
    }
    return;
  }

  throw new ApiError(400, "Admins cannot block users");
}

export async function unblockUser(
  actorId: string,
  actorRole: Role,
  targetUserId: string,
): Promise<void> {
  if (actorRole === "student") {
    const account = await User.findById(actorId);
    if (!account) throw new ApiError(404, "Account not found");

    account.blockedUserIds = account.blockedUserIds.filter(
      (id) => id.toString() !== targetUserId,
    );
    await account.save();
    return;
  }

  if (actorRole === "teacher") {
    const account = await Teacher.findById(actorId);
    if (!account) throw new ApiError(404, "Account not found");

    account.blockedUserIds = account.blockedUserIds.filter(
      (id) => id.toString() !== targetUserId,
    );
    await account.save();
    return;
  }

  throw new ApiError(400, "Admins do not have a block list");
}

export async function getBlockedUserIds(
  actorId: string,
  actorRole: Role,
): Promise<string[]> {
  if (actorRole === "student") {
    const account = await User.findById(actorId);
    if (!account) throw new ApiError(404, "Account not found");
    return account.blockedUserIds.map((id) => id.toString());
  }

  if (actorRole === "teacher") {
    const account = await Teacher.findById(actorId);
    if (!account) throw new ApiError(404, "Account not found");
    return account.blockedUserIds.map((id) => id.toString());
  }

  return [];
}

export async function createReport(
  reporterId: string,
  targetType: "message" | "user",
  targetId: string,
  reason: string,
): Promise<void> {
  if (!reason || reason.trim().length === 0) {
    throw new ApiError(400, "A reason is required to submit a report");
  }

  await Report.create({
    reporterId,
    targetType,
    targetId,
    reason: reason.trim(),
    status: "pending",
  });
}
