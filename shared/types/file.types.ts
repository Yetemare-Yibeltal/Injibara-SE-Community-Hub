export type UploaderRole = "student" | "teacher";

export interface FileDTO {
  id: string;
  uploaderId: string;
  uploaderRole: UploaderRole;
  chatId?: string;
  courseId?: string;
  batchScope?: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  cloudinaryUrl: string;
  createdAt: string;
}
