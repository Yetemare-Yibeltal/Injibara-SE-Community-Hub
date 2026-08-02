import User from "../models/user.model";
import Chat from "../models/chat.model";
import AuditLog from "../models/auditLog.model";
import { ApiError } from "../middlewares/errorHandler.middleware";

const YEAR_ORDER = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

interface PromotionResult {
  fromBatch: string;
  toBatch: string | "alumni";
  studentsPromoted: number;
  chatsArchived: number;
}

function getNextBatch(currentBatch: string): string | "alumni" {
  const index = YEAR_ORDER.indexOf(currentBatch);

  if (index === -1) {
    throw new ApiError(400, `Unrecognized batch label: "${currentBatch}"`);
  }

  if (index === YEAR_ORDER.length - 1) {
    return "alumni";
  }

  return YEAR_ORDER[index + 1];
}

export async function promoteBatch(
  fromBatch: string,
  adminId: string,
): Promise<PromotionResult> {
  const nextBatch = getNextBatch(fromBatch);

  let studentsPromoted: number;

  if (nextBatch === "alumni") {
    const result = await User.updateMany(
      { batch: fromBatch, status: "active" },
      { status: "alumni" },
    );
    studentsPromoted = result.modifiedCount;
  } else {
    const result = await User.updateMany(
      { batch: fromBatch, status: "active" },
      { batch: nextBatch },
    );
    studentsPromoted = result.modifiedCount;
  }

  const chatResult = await Chat.updateMany(
    { batchScope: fromBatch, isArchived: false },
    { isArchived: true },
  );

  await AuditLog.create({
    actorId: adminId,
    action: "promote_batch",
    targetType: "Batch",
    targetId: adminId,
    metadata: { fromBatch, toBatch: nextBatch, studentsPromoted },
  });

  return {
    fromBatch,
    toBatch: nextBatch,
    studentsPromoted,
    chatsArchived: chatResult.modifiedCount,
  };
}
