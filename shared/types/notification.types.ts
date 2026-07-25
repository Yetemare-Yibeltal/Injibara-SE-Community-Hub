export type NotificationType =
  | "mention"
  | "reaction"
  | "announcement"
  | "assignment";

export interface NotificationDTO {
  id: string;
  recipientId: string;
  type: NotificationType;
  sourceId: string;
  read: boolean;
  createdAt: string;
}
