import { useQuery } from '@tanstack/react-query';
import { trackingService } from '@/services/trackingService';

/** Lightweight trip fetch for dashboards (driver route preview, ETA). */
export function useTripByBooking(bookingId, enabled = true) {
  return useQuery({
    queryKey: ['trips', 'booking', bookingId],
    queryFn: () => trackingService.getTripByBooking(bookingId),
    enabled: !!bookingId && enabled,
    retry: false,
    staleTime: 45 * 1000,
  });
}
