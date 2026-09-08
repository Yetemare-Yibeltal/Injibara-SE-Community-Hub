import type { MessageDTO } from '@shared/types';
import { useAuth } from '../auth/useAuth';

interface MessageBubbleProps {
  message: MessageDTO;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuth();
  const isOwn = user?.id === message.senderId;

  if (message.deletedForEveryone) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="bg-gray-900 text-gray-500 text-sm italic rounded-2xl px-4 py-2 max-w-xs">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`rounded-2xl px-4 py-2 max-w-xs sm:max-w-md break-words ${
          isOwn
            ? 'bg-primary-600 text-white rounded-br-sm'
            : 'bg-gray-800 text-gray-100 rounded-bl-sm'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-[10px] ${isOwn ? 'text-primary-200' : 'text-gray-500'}`}>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {message.editedAt && (
            <span className={`text-[10px] ${isOwn ? 'text-primary-200' : 'text-gray-500'}`}>
              (edited)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}