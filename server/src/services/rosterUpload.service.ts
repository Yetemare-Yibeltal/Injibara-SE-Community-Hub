import { parseCsv } from "../utils/csvParser.util";
import User from "../models/user.model";
import { ApiError } from "../middlewares/errorHandler.middleware";

interface RosterUploadResult {
  created: number;
  skipped: number;
  errors: string[];
}

const DEFAULT_TEMP_PASSWORD_PREFIX = "Temp";

export async function uploadRoster(
  csvContent: string,
  defaultBatch: string,
): Promise<RosterUploadResult> {
  const rows = parseCsv(csvContent);

  if (rows.length === 0) {
    throw new ApiError(400, "CSV file is empty or invalid");
  }

  const result: RosterUploadResult = { created: 0, skipped: 0, errors: [] };

  for (const row of rows) {
    const studentId = row.ID || row.studentId || row.id;
    const firstName = row.Fname || row.firstName || row.first;
    const middleName = row.Mname || row.middleName || row.middle;
    const lastName = row.Lname || row.lastName || row.last;
    const batch = row.batch || defaultBatch;
    const enrollmentType =
      row.enrollmentType === "transfer" ? "transfer" : "direct";

    if (!studentId || !firstName || !lastName) {
      result.errors.push(
        `Skipped row with missing required fields: ${JSON.stringify(row)}`,
      );
      continue;
    }

    const existing = await User.findOne({ studentId });
    if (existing) {
      result.skipped++;
      continue;
    }

    try {
      await User.create({
        studentId,
        passwordHash: `${DEFAULT_TEMP_PASSWORD_PREFIX}${studentId}`,
        fullName: {
          first: firstName,
          middle: middleName || "",
          last: lastName,
        },
        role: "student",
        batch,
        enrollmentType,
        status: "pending",
      });
      result.created++;
    } catch (error) {
      result.errors.push(
        `Failed to create ${studentId}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  return result;
}
