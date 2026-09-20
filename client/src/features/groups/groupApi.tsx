import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { fetchChats } from '../chat/chatApi';
import { Plus, Users } from 'lucide-react';
import CreateGroupModal from './CreateGroupModal';

export default function GroupList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: fetchChats,
  });

  const groups = chats?.filter(({ chat }) => chat.type === 'custom' || chat.type === 'private');

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Groups</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Group
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">Loading groups...</p>
      ) : !groups || groups.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-12">
          <Users className="mx-auto mb-2 opacity-50" size={32} />
          No groups yet. Create one to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map(({ chat, unreadCount }) => (
            <button
              key={chat.id}
              onClick={() => navigate(`/chats/${chat.id}`)}
              className="w-full text-left flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-lg px-4 py-3 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-white">{chat.name}</p>
                <p className="text-xs text-gray-500">{chat.memberIds.length} members</p>
              </div>
              {unreadCount > 0 && (
                <span className="bg-primary-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}