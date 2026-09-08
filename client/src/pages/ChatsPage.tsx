import ChatList from '../features/chat/ChatList';
import ChatWindow from '../features/chat/ChatWindow';

export default function ChatsPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-full sm:w-80 border-r border-gray-800 overflow-y-auto scrollbar-thin">
        <div className="px-4 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">Chats</h2>
        </div>
        <ChatList />
      </div>
      <div className="hidden sm:flex flex-1">
        <ChatWindow />
      </div>
    </div>
  );
}