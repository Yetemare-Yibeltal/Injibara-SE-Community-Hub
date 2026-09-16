import { useAuth } from '../auth/useAuth';
import EditProfileForm from './EditProfileForm';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const identifier =
    'studentId' in user ? user.studentId : 'teacherId' in user ? user.teacherId : user.adminId;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-xl">
          {user.fullName.first[0]}
          {user.fullName.last[0]}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            {user.fullName.first} {user.fullName.middle} {user.fullName.last}
          </h1>
          <p className="text-gray-500 text-sm">
            {identifier} &middot; <span className="capitalize">{user.role}</span>
          </p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Edit Profile</h2>
        <EditProfileForm />
      </div>
    </div>
  );
}