import { connectDB, disconnectDB } from "../config/db.config";
import User from "../models/user.model";
import Teacher from "../models/teacher.model";
import logger from "../config/logger.config";

async function seed(): Promise<void> {
  await connectDB();

  const existingStudent = await User.findOne({ studentId: "TEST-STU-001" });
  if (existingStudent) {
    logger.info("Test student already exists, skipping creation.");
  } else {
    await User.create({
      studentId: "TEST-STU-001",
      passwordHash: "Password123",
      fullName: { first: "Test", middle: "Student", last: "Account" },
      role: "student",
      batch: "3rd Year",
      enrollmentType: "direct",
      status: "active",
    });
    logger.info("Test student created: TEST-STU-001 / Password123");
  }

  const existingTeacher = await Teacher.findOne({ teacherId: "TEST-TCH-001" });
  if (existingTeacher) {
    logger.info("Test teacher already exists, skipping creation.");
  } else {
    await Teacher.create({
      teacherId: "TEST-TCH-001",
      passwordHash: "Password123",
      fullName: { first: "Test", middle: "Teacher", last: "Account" },
      email: "test.teacher@example.com",
      role: "teacher",
      status: "active",
      assignedCourses: [],
    });
    logger.info("Test teacher created: TEST-TCH-001 / Password123");
  }

  await disconnectDB();
  logger.info("Seeding complete.");
  process.exit(0);
}

seed().catch((error) => {
  logger.error(
    `Seeding failed: ${error instanceof Error ? error.message : "Unknown error"}`,
  );
  process.exit(1);
});
