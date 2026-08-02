import Teacher, { ITeacher } from "../models/teacher.model";
import AuditLog from "../models/auditLog.model";
import { ApiError } from "../middlewares/errorHandler.middleware";

interface CreateTeacherInput {
  teacherId: string;
  email: string;
  fullName: { first: string; middle: string; last: string };
}

export async function createTeacher(
  input: CreateTeacherInput,
  adminId: string,
): Promise<ITeacher> {
  const existing = await Teacher.findOne({ teacherId: input.teacherId });
  if (existing) {
    throw new ApiError(409, "A teacher with this ID already exists");
  }

  const teacher = await Teacher.create({
    teacherId: input.teacherId,
    email: input.email,
    fullName: input.fullName,
    passwordHash: `Temp${input.teacherId}`,
    status: "pending_approval",
    assignedCourses: [],
  });

  await AuditLog.create({
    actorId: adminId,
    action: "create_teacher",
    targetType: "Teacher",
    targetId: teacher._id,
    metadata: { teacherId: input.teacherId },
  });

  return teacher;
}

export async function approveTeacher(
  teacherId: string,
  adminId: string,
): Promise<ITeacher> {
  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  teacher.status = "active";
  await teacher.save();

  await AuditLog.create({
    actorId: adminId,
    action: "approve_teacher",
    targetType: "Teacher",
    targetId: teacher._id,
    metadata: {},
  });

  return teacher;
}

export async function assignCourseToTeacher(
  teacherId: string,
  courseId: string,
  batch: string,
  section: string | undefined,
  adminId: string,
): Promise<ITeacher> {
  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  const alreadyAssigned = teacher.assignedCourses.some(
    (c) => c.courseId.toString() === courseId && c.batch === batch,
  );

  if (!alreadyAssigned) {
    teacher.assignedCourses.push({
      courseId: courseId as never,
      batch,
      section,
    });
    await teacher.save();

    await AuditLog.create({
      actorId: adminId,
      action: "assign_course",
      targetType: "Teacher",
      targetId: teacher._id,
      metadata: { courseId, batch, section },
    });
  }

  return teacher;
}

export async function removeCourseFromTeacher(
  teacherId: string,
  courseId: string,
  batch: string,
): Promise<ITeacher> {
  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  teacher.assignedCourses = teacher.assignedCourses.filter(
    (c) => !(c.courseId.toString() === courseId && c.batch === batch),
  );

  await teacher.save();
  return teacher;
}

export async function listTeachers(): Promise<ITeacher[]> {
  return Teacher.find().sort({ createdAt: -1 });
}

export async function listAuditLogs(limit = 100) {
  return AuditLog.find().sort({ createdAt: -1 }).limit(limit);
}
