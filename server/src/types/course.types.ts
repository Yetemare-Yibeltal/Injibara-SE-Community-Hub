export interface CourseDTO {
  id: string;
  name: string;
  code: string;
  batch: string;
  teacherIds: string[];
  semester: string;
  createdAt: string;
  updatedAt: string;
}
