import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { fetchUnreadCount } from './notificationApi';

export default function NotificationBell() {
  const navigate = useNavigate();

  const { data: count } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: fetchUnreadCount,
    refetchInterval: 30000,
  });

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative text-gray-400 hover:text-white transition-colors"
    >
      <Bell size={20} />
      {!!count && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-medium rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}