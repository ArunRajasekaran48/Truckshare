import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UIContext } from '@/context/UIContext';

export function Header({ onMenuToggle }) {
  const { user, logout, isTruckOwner, isDriver } = useAuth();
  const { toast } = useContext(UIContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const dashboardPath = isTruckOwner
    ? '/dashboard/owner'
    : isDriver
      ? '/dashboard/driver'
      : '/dashboard/business';

  return (
    <header className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 border-b-4 border-blue-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-xl">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-white hover:bg-white/20 lg:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link to={dashboardPath} className="flex items-center gap-2 lg:hidden">
          <span className="text-2xl">🚛</span>
          <span className="font-bold text-white text-lg hidden sm:block">TruckShare</span>
        </Link>
      </div>

      {/* Right: role badge + user menu */}
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-white/20 text-white border-2 border-white/40 backdrop-blur-sm">
          {user?.role === 'TRUCK_OWNER'
            ? '🚚 Truck Owner'
            : user?.role === 'DRIVER'
              ? '👨‍💼 Driver'
              : '📦 Business'}
        </span>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {user?.userId?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-sm text-white font-bold">{user?.userId}</span>
            <svg className="w-4 h-4 text-white hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-blue-200 rounded-lg shadow-2xl z-20 py-2 backdrop-blur-sm">
                <div className="px-4 py-3 border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <p className="text-xs text-slate-500 font-bold uppercase">Signed in as</p>
                  <p className="text-sm font-bold text-slate-900 truncate mt-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.userId}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-bold flex items-center gap-2"
                >
                  🚪 Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
