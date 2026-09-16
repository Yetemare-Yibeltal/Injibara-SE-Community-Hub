import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { createGroup } from './groupApi';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [memberIdsInput, setMemberIdsInput] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      const memberIds = memberIdsInput
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
      return createGroup(name.trim(), memberIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setName('');
      setMemberIdsInput('');
      onClose();
    },
  });

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    if (!name.trim() || !memberIdsInput.trim()) return;
    mutation.mutate();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Create Group</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="e.g. Final Year Project Team"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Member IDs (comma-separated)
            </label>
            <input
              type="text"
              value={memberIdsInput}
              onChange={(e) => setMemberIdsInput(e.target.value)}
              className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="id1, id2, id3"
            />
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm">Failed to create group. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {mutation.isPending ? 'Creating...' : 'Create Group'}
          </button>
        </form>
      </div>
    </div>
  );
}