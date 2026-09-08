import { useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export default function MessageInput({ onSend, onTyping }: MessageInputProps) {
  const [content, setContent] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setContent(e.target.value);

    onTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 2000);
  }

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setContent('');
    onTyping(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-gray-800 bg-gray-950 p-3"
    >
      <input
        type="text"
        value={content}
        onChange={handleChange}
        placeholder="Type a message..."
        className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
      />
      <button
        type="submit"
        disabled={!content.trim()}
        className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
      >
        <Send size={18} />
      </button>
    </form>
  );
}