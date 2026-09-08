import { Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../features/auth/useAuth';
import { logoutRequest } from '../../features/auth/authApi';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout(): Promise<void> {
    try {
      await logoutRequest();
    } finally {
      logout();
      navigate('/login');
    }
  }

  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-gray-500 flex-1 max-w-md">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm text-gray-300 placeholder-gray-500 w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">
              {user?.fullName.first} {user?.fullName.last}
            </p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium text-sm">
            {user?.fullName.first?.[0]}
            {user?.fullName.last?.[0]}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-400 transition-colors"
          title="Log out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}