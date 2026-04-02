import { formatDateTime } from '@/utils/formatters';

const DEFAULT_TRANSIT_HOURS = 8;

/**
 * Rough ETA when backend has no estimatedDuration: departure + N hours.
 * Uses trip.startedAt (Java) or legacy trip.startTime.
 */
export function estimateDeliveryDisplay(trip) {
  if (!trip) return null;
  if (trip.status === 'COMPLETED') {
    return { kind: 'done', text: 'Trip completed' };
  }
  const started = trip.startedAt ?? trip.startTime;
  const hours =
    typeof trip.estimatedDuration === 'number' && trip.estimatedDuration > 0
      ? trip.estimatedDuration
      : DEFAULT_TRANSIT_HOURS;

  if (trip.status === 'IN_TRANSIT' && started) {
    const etaMs = new Date(started).getTime() + hours * 3600000;
    return {
      kind: 'eta',
      text: formatDateTime(new Date(etaMs).toISOString()),
      subtext: `~${hours}h from departure (estimate)`,
    };
  }

  if (trip.status === 'PLANNED' || trip.status === 'LOADING') {
    return {
      kind: 'pending',
      text: null,
      subtext: 'Estimated arrival shows once the trip is in transit.',
    };
  }

  return null;
}
