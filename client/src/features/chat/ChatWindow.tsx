import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMessages } from './chatApi';
import { useSocketMessages } from './useSocketMessages';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { MessageSquare } from 'lucide-react';
import { useEffect } from 'react';

export default function ChatWindow() {
  const { chatId } = useParams<{ chatId: string }>();
  const queryClient = useQueryClient();
  const { sendMessage, notifyTyping } = useSocketMessages(chatId ?? null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => fetchMessages(chatId as string),
    enabled: !!chatId,
  });

  useEffect(() => {
    return () => {
      if (chatId) {
        queryClient.removeQueries({ queryKey: ['messages', chatId] });
      }
    };
  }, [chatId, queryClient]);

  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
        <MessageSquare size={48} className="mb-3 opacity-40" />
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse scrollbar-thin">
        {isLoading ? (
          <p className="text-gray-500 text-sm text-center">Loading messages...</p>
        ) : messages && messages.length > 0 ? (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        ) : (
          <p className="text-gray-500 text-sm text-center">
            No messages yet. Say hello!
          </p>
        )}
      </div>

      <MessageInput onSend={sendMessage} onTyping={notifyTyping} />
    </div>
  );
}