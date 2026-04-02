import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { truckService } from '@/services/truckService';

export function useTruck(truckId, queryOptions = {}) {
  return useQuery({
    queryKey: ['trucks', truckId],
    queryFn: () => truckService.getById(truckId),
    enabled: !!truckId,
    ...queryOptions,
  });
}

export function useTrucksByOwner() {
  return useQuery({
    queryKey: ['trucks', 'owner'],
    queryFn: () => truckService.getTrucksByOwner(),
  });
}

export function useTruckByDriver(driverId) {
  return useQuery({
    queryKey: ['trucks', 'driver', driverId],
    queryFn: () => truckService.getAssignedTruck(driverId),
    enabled: !!driverId,
    retry: false,
  });
}

export function useSearchTrucks(params) {
  return useQuery({
    queryKey: ['trucks', 'search', params],
    queryFn: () => truckService.search(params),
    enabled: !!(params?.from && params?.to),
  });
}

export function useAddTruck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => truckService.addTruck(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trucks', 'owner'] }),
  });
}

export function useUpdateTruck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => truckService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['trucks', 'owner'] });
      qc.invalidateQueries({ queryKey: ['trucks', id] });
    },
  });
}

export function useDeleteTruck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => truckService.deleteTruck(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trucks', 'owner'] }),
  });
}

export function useAssignDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ truckId, driverId, driverName }) => 
      truckService.assignDriver(truckId, driverId, driverName),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trucks', 'owner'] });
      qc.invalidateQueries({ queryKey: ['trucks'] });
    },
  });
}

export function useUnassignDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (truckId) => truckService.unassignDriver(truckId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trucks', 'owner'] });
      qc.invalidateQueries({ queryKey: ['trucks'] });
    },
  });
}
