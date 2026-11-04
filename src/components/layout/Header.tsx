import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_LABEL } from '../../utils/constants';

export default function Header({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="no-print flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-8">
      <button onClick={onMenu} aria-label="Open menu" className="rounded p-2 hover:bg-gray-100 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>
      <div className="ml-auto flex items-center gap-4">
        <div className="text-right text-sm">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-gray-500">{user ? ROLE_LABEL[user.role] : ''}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-100">
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </header>
  );
}
