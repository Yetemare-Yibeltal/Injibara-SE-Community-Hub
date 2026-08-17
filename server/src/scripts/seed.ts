import { connectDB, disconnectDB } from "../config/db.config";
import User from "../models/user.model";
import Teacher from "../models/teacher.model";
import Admin from "../models/admin.model";
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

  const existingAdmin = await Admin.findOne({ adminId: "TEST-ADM-001" });
  if (existingAdmin) {
    logger.info("Test admin already exists, skipping creation.");
  } else {
    await Admin.create({
      adminId: "TEST-ADM-001",
      passwordHash: "Password123",
      fullName: { first: "Test", middle: "Admin", last: "Account" },
      email: "test.admin@example.com",
      role: "admin",
      status: "active",
    });
    logger.info("Test admin created: TEST-ADM-001 / Password123");
  }

  await disconnectDB();
  logger.info("Seeding complete.");
  process.exit(0);
}


