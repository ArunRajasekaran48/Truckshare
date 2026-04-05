import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ownerNav = [
  { to: '/dashboard/owner',   label: 'Dashboard',   icon: '🏠' },
  { to: '/trucks/add',        label: 'Add Truck',    icon: '➕' },
  { to: '/bookings',          label: 'Bookings',     icon: '📋' },
];

const businessNav = [
  { to: '/dashboard/business', label: 'Dashboard',    icon: '🏠' },
  { to: '/shipments/create',   label: 'New Shipment', icon: '➕' },
  { to: '/shipments',          label: 'My Shipments', icon: '📦' },
  { to: '/bookings',           label: 'Bookings',     icon: '📋' },
];

const driverNav = [
  { to: '/dashboard/driver', label: 'Dashboard', icon: '🏠' },
  { to: '/bookings', label: 'Trips & bookings', icon: '📋' },
];

function NavItem({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-l-4 border-blue-700 shadow-lg'
            : 'text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-slate-900'
        }`
      }
    >
      <span className="text-lg w-6 text-center">{icon}</span>
      {label}
    </NavLink>
  );
}

export function Sidebar({ isOpen, onClose }) {
  const { isTruckOwner, isDriver, user } = useAuth();
  const navItems = isTruckOwner ? ownerNav : isDriver ? driverNav : businessNav;

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo area (desktop) */}
      <div className="hidden lg:flex items-center gap-3 px-5 py-6 border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <span className="text-3xl">🚛</span>
        <div>
          <p className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TruckShare</p>
          <p className="text-xs text-slate-500 font-semibold">Logistics Hub</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-2 bg-gradient-to-b from-white to-blue-50">
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest px-2 mb-4 flex items-center gap-2">
          <span className="text-lg">
            {isTruckOwner ? '🚚' : isDriver ? '👨‍💼' : '📦'}
          </span>
          {isTruckOwner ? 'Truck Owner' : isDriver ? 'Driver' : 'Business'}
        </p>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onClose} />
        ))}
      </nav>

    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r-2 border-blue-200 fixed left-0 top-0 h-full z-20 shadow-xl">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 lg:hidden shadow-2xl border-r-2 border-blue-200">
            {content}
          </aside>
        </>
      )}
    </>
  );
}
