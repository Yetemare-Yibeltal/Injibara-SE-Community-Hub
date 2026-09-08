import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchChats } from './chatApi';
import { MessageSquare } from 'lucide-react';

export default function ChatList() {
  const navigate = useNavigate();
  const { chatId: activeChatId } = useParams();

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
  });

  if (isLoading) {
    return <div className="p-4 text-gray-500 text-sm">Loading chats...</div>;
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 text-sm">
        <MessageSquare className="mx-auto mb-2 opacity-50" size={32} />
        No chats yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800">
      {chats.map(({ chat, unreadCount }) => (
        <button
          key={chat.id}
          onClick={() => navigate(`/chats/${chat.id}`)}
          className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-900 transition-colors ${
            activeChatId === chat.id ? 'bg-gray-900' : ''
          }`}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{chat.name}</p>
            <p className="text-xs text-gray-500 capitalize">{chat.type}</p>
          </div>
          {unreadCount > 0 && (
            <span className="bg-primary-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}