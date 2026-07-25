export type ChatType = "batch" | "course" | "department" | "private" | "custom";

export interface ChatDTO {
  id: string;
  type: ChatType;
  name: string;
  batchScope?: string;
  courseId?: string;
  memberIds: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
