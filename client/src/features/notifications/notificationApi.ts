import axiosClient from "../../lib/axiosClient";
import type { NotificationDTO } from "@shared/types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchNotifications(
  unreadOnly = false,
): Promise<NotificationDTO[]> {
  const response = await axiosClient.get<ApiResponse<NotificationDTO[]>>(
    "/notifications",
    {
      params: { unreadOnly },
    },
  );
  return response.data.data;
}

export async function fetchUnreadCount(): Promise<number> {
  const response = await axiosClient.get<ApiResponse<{ count: number }>>(
    "/notifications/unread-count",
  );
  return response.data.data.count;
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<NotificationDTO> {
  const response = await axiosClient.patch<ApiResponse<NotificationDTO>>(
    `/notifications/${notificationId}/read`,
  );
  return response.data.data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await axiosClient.patch("/notifications/read-all");
}
