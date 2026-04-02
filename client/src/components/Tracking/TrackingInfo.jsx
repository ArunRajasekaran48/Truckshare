import { StatusBadge } from '@/components/Common/StatusBadge';
import { formatDateTime, truncateId } from '@/utils/formatters';

const tripSteps = ['PLANNED', 'LOADING', 'IN_TRANSIT', 'COMPLETED'];

export function TrackingInfo({ trip, location }) {
  const stepIndex = tripSteps.indexOf(trip?.status);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-gray-400 font-mono">Trip #{truncateId(trip?.id)}</p>
        <div className="flex items-center gap-2 mt-1">
          <StatusBadge status={trip?.status} />
        </div>
      </div>

      {/* Progress timeline */}
      <div className="space-y-2">
        {tripSteps.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? 'bg-teal-600 text-white' : active ? 'bg-teal-100 border-2 border-teal-600 text-teal-700' : 'bg-gray-100 text-gray-400'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${active ? 'text-teal-700 font-semibold' : done ? 'text-gray-500 line-through' : 'text-gray-400'}`}>
                {s.replace('_', ' ')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Live location */}
      {location && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-teal-700">📍 Live Location</p>
          <p className="text-xs text-gray-600">
            {location.latitude?.toFixed(5)}, {location.longitude?.toFixed(5)}
          </p>
          <p className="text-xs text-gray-400">Updated: {formatDateTime(location.timestamp)}</p>
          <p className="text-[10px] text-teal-800/80 leading-snug pt-1 border-t border-teal-100 mt-2">
            The teal line on the map is a straight corridor between shipment cities (approximate). Your live point is GPS — expect offset from the line while driving.
          </p>
        </div>
      )}

      {!location && trip?.status === 'IN_TRANSIT' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
          <p className="text-xs text-amber-600">Waiting for first location update…</p>
        </div>
      )}

      {/* Trip meta */}
      <div className="space-y-2 text-sm">
        {[
          { label: 'Booking', val: `#${truncateId(trip?.bookingId)}` },
          { label: 'Started', val: formatDateTime(trip?.startedAt ?? trip?.startTime) },
          { label: 'Est. Duration', val: trip?.estimatedDuration ? `${trip.estimatedDuration}h` : '-' },
        ].map(({ label, val }) => (
          <div key={label} className="flex justify-between">
            <span className="text-gray-400">{label}</span>
            <span className="font-medium text-gray-700">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
