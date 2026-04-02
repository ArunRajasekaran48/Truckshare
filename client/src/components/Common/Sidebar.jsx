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
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-teal-50 text-teal-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
      <div className="hidden lg:flex items-center gap-2 px-4 py-5 border-b border-gray-100">
        <span className="text-2xl">🚛</span>
        <span className="font-bold text-gray-900">TruckShare</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
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
      <aside className="hidden lg:flex lg:flex-col w-56 bg-white border-r border-gray-200 fixed left-0 top-0 h-full z-20">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 lg:hidden shadow-xl">
            {content}
          </aside>
        </>
      )}
    </>
  );
}
