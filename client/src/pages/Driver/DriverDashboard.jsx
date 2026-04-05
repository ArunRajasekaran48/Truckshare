import { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Common/Layout';
import { StatCard } from '@/components/Dashboard/StatCard';
import { BookingCard } from '@/components/Booking/BookingCard';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';
import { EmptyState } from '@/components/Common/EmptyState';
import { StatusBadge } from '@/components/Common/StatusBadge';
import { TruckCard } from '@/components/Truck/TruckCard';
import { useAuth } from '@/hooks/useAuth';
import { useTruckByDriver } from '@/hooks/useTruck';
import { useBookings } from '@/hooks/useBooking';
import { useShipment } from '@/hooks/useShipment';
import { authService } from '@/services/authService';
import { UIContext } from '@/context/UIContext';

export function DriverDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useContext(UIContext);
  const qc = useQueryClient();
  const { data: truck, isLoading: truckLoading } = useTruckByDriver(user?.userId);
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: profile } = useQuery({
    queryKey: ['users', user?.userId],
    queryFn: () => authService.getUser(user.userId),
    enabled: !!user?.userId,
  });

  const availabilityMutation = useMutation({
    mutationFn: (status) => authService.updateDriverAvailability(user.userId, status),
    onSuccess: (_, status) => {
      qc.invalidateQueries({ queryKey: ['users', user?.userId] });
      qc.invalidateQueries({ queryKey: ['users', 'drivers'] });
      toast.success(`Driver status updated to ${status.replace('_', ' ')}`);
    },
    onError: (e) => {
      toast.error(e.message || 'Failed to update driver status');
    },
  });

  const confirmed = bookings.filter((b) => b.paymentConfirmed);
  const pending = bookings.filter((b) => !b.paymentConfirmed);

  /** Map: your current GPS → this shipment’s drop-off (not the truck’s registered lane). */
  const primaryBooking = useMemo(
    () => confirmed[0] || bookings[0],
    [confirmed, bookings]
  );

  const { data: mapShipment } = useShipment(primaryBooking?.shipmentId);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Driver Dashboard</h1>
          <p className="text-sm text-slate-600 mt-2">
            View your assigned truck and active trips
          </p>
        </div>

        <div className="card p-5 border border-teal-200 bg-gradient-to-r from-teal-50/60 to-white">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span aria-hidden>📡</span>
            Route (quick view)
          </h2>
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            This is a quick route summary. For the live moving truck map and GPS sharing, open <strong>Tracking</strong> on a booking.
          </p>
        </div>

        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-900">Driver Availability</p>
              <p className="text-xs text-slate-600 mt-1.5">Set your current assignment status so owners cannot assign you while you are on a trip.</p>
            </div>
            <StatusBadge status={profile?.driverAvailability || 'AVAILABLE'} />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['AVAILABLE', 'ON_TRIP', 'UNAVAILABLE'].map((status) => (
              <button
                key={status}
                type="button"
                disabled={availabilityMutation.isPending || (profile?.driverAvailability || 'AVAILABLE') === status}
                onClick={() => availabilityMutation.mutate(status)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-full border transition-colors ${
                  (profile?.driverAvailability || 'AVAILABLE') === status
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Assigned truck" value={truck ? 1 : 0} icon="🚛" color="teal" />
          <StatCard label="Total bookings" value={bookings.length} icon="📋" color="amber" />
          <StatCard label="Pending" value={pending.length} icon="⏳" color="amber" />
          <StatCard label="Ready to drive" value={confirmed.length} icon="✅" color="green" />
        </div>

        {bookings.length > 0 && mapShipment?.fromLocation && mapShipment?.toLocation && (
          <div className="card p-5">
            <h2 className="font-bold text-slate-900">Current trip route</h2>
            <p className="text-xs text-slate-600 mt-1.5 mb-4">
              From <span className="font-semibold text-slate-900">{mapShipment.fromLocation}</span> to{' '}
              <span className="font-semibold text-slate-900">{mapShipment.toLocation}</span>
              <span className="text-slate-500"> · from your current / latest booking</span>
            </p>

            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
              <div className="flex justify-between gap-2 text-[11px] sm:text-xs font-semibold text-slate-800">
                <span className="truncate max-w-[42%]" title={mapShipment.fromLocation}>
                  <span className="text-teal-600 mr-0.5" aria-hidden>
                    ●
                  </span>
                  {mapShipment.fromLocation}
                </span>
                <span className="text-slate-300 font-normal shrink-0">→</span>
                <span className="truncate max-w-[42%] text-right" title={mapShipment.toLocation}>
                  <span className="text-slate-500 mr-0.5" aria-hidden>
                    ◆
                  </span>
                  {mapShipment.toLocation}
                </span>
              </div>

              <div className="relative h-7 mt-2 mx-1">
                <div
                  className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-teal-500 via-teal-300 to-slate-200"
                  aria-hidden
                />
                <span
          className="absolute top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 text-[18px] leading-none select-none drop-shadow-sm"
          style={{ left: '18%' }}
          title="Open Tracking for live map"
          aria-hidden
        >
              <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>
                🚛
              </span>
            </span>
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className="text-xs font-semibold text-teal-700 hover:underline"
                  onClick={() => primaryBooking?.paymentConfirmed && navigate(`/tracking/${primaryBooking.id}`)}
                  disabled={!primaryBooking?.paymentConfirmed}
                >
                  Open Tracking →
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-bold text-slate-900">Your truck</h2>
            {truckLoading ? (
              <LoadingSpinner text="Loading assignment…" />
            ) : !truck ? (
              <EmptyState
                icon="🚛"
                title="No truck assigned yet"
                description="When a truck owner assigns you to a vehicle, it will show here."
              />
            ) : (
              <TruckCard truck={truck} />
            )}
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Recent trips</h2>
              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                View all →
              </button>
            </div>
            {bookingsLoading ? (
              <LoadingSpinner />
            ) : bookings.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No bookings yet"
                description="Bookings for your truck will appear here once the owner receives loads."
              />
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {bookings.slice(0, 5).map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    isTruckOwner={false}
                    trackLabel="🚛 Trip & live map"

                    onTrack={
                      booking.paymentConfirmed
                        ? (id) => navigate(`/tracking/${id}`)
                        : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
