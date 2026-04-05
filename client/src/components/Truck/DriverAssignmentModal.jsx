import { useState, useMemo } from 'react';
import { Modal } from '../Common/Modal';
import { useDrivers } from '@/hooks/useAuth';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { EmptyState } from '../Common/EmptyState';
import { StatusBadge } from '../Common/StatusBadge';

export function DriverAssignmentModal({ isOpen, onClose, onAssign, isLoading, currentDriverId }) {
  const { data: drivers = [], isLoading: driversLoading } = useDrivers();
  const [search, setSearch] = useState('');

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => 
      d.userId.toLowerCase().includes(search.toLowerCase()) ||
      (d.name && d.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [drivers, search]);

  const canAssign = (driver) => {
    if (driver.userId === currentDriverId) return false;
    return (driver.driverAvailability || 'AVAILABLE') === 'AVAILABLE';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Driver">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* List */}
        <div className="max-h-[350px] overflow-y-auto pr-1">
          {driversLoading ? (
            <div className="py-12"><LoadingSpinner size="sm" /></div>
          ) : filteredDrivers.length === 0 ? (
            <div className="py-12">
              <EmptyState 
                icon="👥" 
                title="No drivers found" 
                description="No registered drivers match your search" 
              />
            </div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
              {filteredDrivers.map((driver) => (
                <button
                  key={driver.userId}
                  onClick={() => onAssign(driver)}
                  disabled={isLoading || !canAssign(driver)}
                  className={`w-full flex items-center justify-between p-3 transition-colors text-left ${
                    !canAssign(driver)
                      ? 'bg-gray-50 cursor-default' 
                      : 'hover:bg-teal-50/50 group'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      driver.userId === currentDriverId ? 'bg-gray-200 text-gray-500' : 'bg-teal-100 text-teal-700'
                    }`}>
                      {driver.name ? driver.name[0].toUpperCase() : driver.userId[0].toUpperCase()}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${!canAssign(driver) ? 'text-gray-500' : 'text-gray-900'}`}>
                        {driver.name || driver.userId}
                      </p>
                      <p className="text-xs text-gray-400 font-mono lowercase">{driver.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={driver.driverAvailability || 'AVAILABLE'} size="xs" />
                    {driver.userId === currentDriverId ? (
                      <span className="text-[10px] font-medium text-gray-400 px-2 py-0.5 bg-gray-100 rounded">Current</span>
                    ) : canAssign(driver) ? (
                    <span className="text-xs font-medium text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Assign →
                    </span>
                    ) : (
                      <span className="text-[10px] font-medium text-gray-400 px-2 py-0.5 bg-gray-100 rounded">Unavailable</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={onClose} className="btn-secondary text-sm">Cancel</button>
        </div>
      </div>
    </Modal>
  );
}
