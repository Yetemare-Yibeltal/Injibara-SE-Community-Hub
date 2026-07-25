export type UserStatus = "pending" | "active" | "suspended" | "alumni";
export type TeacherStatus = "pending_approval" | "active" | "suspended";
export type EnrollmentType = "direct" | "transfer";

export interface UserProfile {
  photoUrl?: string;
  bio?: string;
  skills?: string[];
  github?: string;
  linkedin?: string;
  portfolio?: string;
  email?: string;
  phone?: string;
}

export interface FullName {
  first: string;
  middle: string;
  last: string;
}

export interface StudentDTO {
  id: string;
  studentId: string;
  fullName: FullName;
  role: "student";
  batch: string;
  enrollmentType: EnrollmentType;
  joinedAt: string;
  status: UserStatus;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface AssignedCourseDTO {
  courseId: string;
  batch: string;
  section?: string;
}

export interface TeacherDTO {
  id: string;
  teacherId: string;
  fullName: FullName;
  email: string;
  role: "teacher";
  status: TeacherStatus;
  assignedCourses: AssignedCourseDTO[];
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export type AccountDTO = StudentDTO | TeacherDTO;
