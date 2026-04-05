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
        <div className="relative overflow-hidden rounded-3xl border border-emerald-300/50 bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-700 p-6 sm:p-8 text-white shadow-[0_18px_45px_-20px_rgba(5,150,105,0.75)]">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" aria-hidden />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] text-emerald-100/90 font-bold">
                Driver Console
              </p>
              <h1 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
                Stay ready for every trip
              </h1>
              <p className="mt-3 max-w-2xl text-sm sm:text-base text-emerald-100/95 font-medium">
                Track active loads, update availability, and jump into live route tracking in one place.
              </p>
            </div>

            <div className="self-start md:self-auto rounded-2xl border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 text-2xl" aria-hidden>
                  🚛
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-emerald-100/80 font-bold">Workspace</p>
                  <p className="text-base font-bold">Driver Hub</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-white via-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-lg font-black text-green-700">Driver Availability</p>
              <p className="text-sm text-green-600 mt-2 font-semibold">Set your status so owners know your availability.</p>
            </div>
            <StatusBadge status={profile?.driverAvailability || 'AVAILABLE'} />
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            {['AVAILABLE', 'ON_TRIP', 'UNAVAILABLE'].map((status) => {
              const colors = {
                'AVAILABLE': 'from-green-500 to-emerald-500 text-white border-green-600',
                'ON_TRIP': 'from-yellow-500 to-orange-500 text-white border-yellow-600',
                'UNAVAILABLE': 'from-red-500 to-pink-500 text-white border-red-600',
              };
              return (
                <button
                  key={status}
                  type="button"
                  disabled={availabilityMutation.isPending || (profile?.driverAvailability || 'AVAILABLE') === status}
                  onClick={() => availabilityMutation.mutate(status)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-full border-2 transition-all transform hover:scale-105 ${
                    (profile?.driverAvailability || 'AVAILABLE') === status
                      ? `bg-gradient-to-r ${colors[status]} shadow-lg`
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
