import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from './notificationApi';
import { Bell, AtSign, Heart, Megaphone, BookOpen } from 'lucide-react';
import type { NotificationDTO, NotificationType } from '@shared/types';

const ICONS: Record<NotificationType, typeof Bell> = {
  mention: AtSign,
  reaction: Heart,
  announcement: Megaphone,
  assignment: BookOpen,
};

const LABELS: Record<NotificationType, string> = {
  mention: 'You were mentioned',
  reaction: 'Someone reacted to your message',
  announcement: 'New announcement',
  assignment: 'New assignment',
};

export default function NotificationList() {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  function handleClick(notification: NotificationDTO): void {
    if (!notification.read) {
      markReadMutation.mutate(notification.id);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        {notifications && notifications.length > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            className="text-sm text-primary-500 hover:text-primary-400"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading notifications...</p>
      ) : !notifications || notifications.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-12">
          <Bell className="mx-auto mb-2 opacity-50" size={32} />
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = ICONS[notification.type];
            return (
              <button
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={`w-full text-left flex items-start gap-3 rounded-lg p-4 border transition-colors ${
                  notification.read
                    ? 'bg-gray-900 border-gray-800'
                    : 'bg-gray-800 border-primary-800'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-white">{LABELS[notification.type]}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}