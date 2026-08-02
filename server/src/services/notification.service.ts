import Notification, { INotification } from "../models/notification.model";
import { ApiError } from "../middlewares/errorHandler.middleware";

export async function listNotifications(
  userId: string,
  unreadOnly = false,
): Promise<INotification[]> {
  const filter: Record<string, unknown> = { recipientId: userId };

  if (unreadOnly) {
    filter.read = false;
  }

  return Notification.find(filter).sort({ createdAt: -1 }).limit(100);
}

export async function markAsRead(
  notificationId: string,
  userId: string,
): Promise<INotification> {
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  if (notification.recipientId.toString() !== userId) {
    throw new ApiError(403, "You cannot modify another user's notification");
  }

  notification.read = true;
  await notification.save();

  return notification;
}

export async function markAllAsRead(userId: string): Promise<void> {
  await Notification.updateMany(
    { recipientId: userId, read: false },
    { read: true },
  );
}

export async function getUnreadCount(userId: string): Promise<number> {
  return Notification.countDocuments({ recipientId: userId, read: false });
}
