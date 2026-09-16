import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from './profileApi';
import { useAuth } from '../auth/useAuth';

export default function EditProfileForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const profile = user && 'profile' in user ? user.profile : undefined;

  const [bio, setBio] = useState(profile?.bio || '');
  const [github, setGithub] = useState(profile?.github || '');
  const [linkedin, setLinkedin] = useState(profile?.linkedin || '');
  const [portfolio, setPortfolio] = useState(profile?.portfolio || '');

  const mutation = useMutation({
    mutationFn: () => updateProfile({ bio, github, linkedin, portfolio }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">GitHub</label>
        <input
          type="url"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="https://github.com/username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn</label>
        <input
          type="url"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Portfolio</label>
        <input
          type="url"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
          placeholder="https://yourportfolio.com"
        />
      </div>

      {mutation.isSuccess && (
        <p className="text-green-400 text-sm">Profile updated successfully.</p>
      )}
      {mutation.isError && (
        <p className="text-red-400 text-sm">Failed to update profile. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
      >
        {mutation.isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}