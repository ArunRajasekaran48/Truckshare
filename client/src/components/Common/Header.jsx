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
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link to={dashboardPath} className="flex items-center gap-2 lg:hidden">
          <span className="text-2xl">🚛</span>
          <span className="font-bold text-gray-900 text-lg hidden sm:block">TruckShare</span>
        </Link>
      </div>

      {/* Right: role badge + user menu */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          {user?.role === 'TRUCK_OWNER'
            ? '🚚 Truck Owner'
            : user?.role === 'DRIVER'
              ? '🧑‍✈️ Driver'
              : '📦 Business'}
        </span>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold">
              {user?.userId?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-sm text-slate-700 font-medium">{user?.userId}</span>
            <svg className="w-4 h-4 text-slate-400 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1.5">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-900 truncate mt-1">{user?.userId}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
