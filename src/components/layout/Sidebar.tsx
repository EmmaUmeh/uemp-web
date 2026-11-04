import { NavLink } from 'react-router-dom';
import { GraduationCap, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS } from './navigation';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      {open && <div className="no-print fixed inset-0 z-30 bg-navy-900/40 lg:hidden" onClick={onClose} />}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6 text-accent" />
            UEMP
          </div>
          <button onClick={onClose} aria-label="Close menu" className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-1 px-3 py-2">
          {NAV_ITEMS[user.role].map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-accent-light text-accent-dark' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
