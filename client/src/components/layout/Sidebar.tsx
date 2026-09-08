import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, BookOpen, FileText, Bell } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/chats', label: 'Chats', icon: MessageSquare },
  { to: '/groups', label: 'Groups', icon: Users },
  { to: '/courses', label: 'Courses', icon: BookOpen },
  { to: '/files', label: 'Files', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-gray-900 border-r border-gray-800 h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">Injibara SE</h1>
        <p className="text-xs text-gray-500">Community Hub</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}