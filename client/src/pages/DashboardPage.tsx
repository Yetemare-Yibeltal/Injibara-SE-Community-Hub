import { useAuth } from '../features/auth/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-1">
        Welcome back, {user?.fullName.first}
      </h1>
      <p className="text-gray-500 mb-8">
        {user?.role === 'student' && 'batch' in (user ?? {}) ? `${(user as { batch?: string }).batch} Student` : ''}
        {user?.role === 'teacher' ? 'Teacher' : ''}
        {user?.role === 'admin' ? 'Department Administrator' : ''}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 text-sm mb-1">Unread Messages</p>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 text-sm mb-1">Active Courses</p>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-500 text-sm mb-1">Notifications</p>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
      </div>
    </div>
  );
}