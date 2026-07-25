export type AnnouncementScope = "batch" | "course" | "department";

export interface AnnouncementDTO {
  id: string;
  authorId: string;
  scope: AnnouncementScope;
  batchScope?: string;
  courseId?: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}
