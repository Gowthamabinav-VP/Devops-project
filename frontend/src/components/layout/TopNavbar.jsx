import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

const TopNavbar = ({ onMenuClick }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-20 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => toast('No new notifications', { icon: '🔔' })}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-full relative"
        >
          <Bell className="h-5 w-5" />
        </button>
        <div className="h-8 w-px bg-slate-200"></div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:block">Sign out</span>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
