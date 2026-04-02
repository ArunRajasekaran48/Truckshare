import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingService.getAll(),
  });
}

export function useBooking(bookingId) {
  return useQuery({
    queryKey: ['bookings', bookingId],
    queryFn: () => bookingService.getById(bookingId),
    enabled: !!bookingId,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => bookingService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
}

export function useAcknowledgePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, paymentReference }) =>
      bookingService.acknowledgePayment(id, paymentReference),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bookings'] }),
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => bookingService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings'] });
      qc.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
}
