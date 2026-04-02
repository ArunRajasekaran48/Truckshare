import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shipmentService } from '@/services/shipmentService';

export function useShipment(shipmentId) {
  return useQuery({
    queryKey: ['shipments', shipmentId],
    queryFn: () => shipmentService.getById(shipmentId),
    enabled: !!shipmentId,
  });
}

export function useShipments() {
  return useQuery({
    queryKey: ['shipments'],
    queryFn: () => shipmentService.getAll(),
  });
}

export function useCreateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => shipmentService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shipments'] }),
  });
}

export function useUpdateShipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => shipmentService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['shipments'] });
      qc.invalidateQueries({ queryKey: ['shipments', id] });
    },
  });
}

export function useUpdateShipmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => shipmentService.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['shipments', id] });
      qc.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
}
