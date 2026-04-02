import { useQuery } from '@tanstack/react-query';
import { matchingService } from '@/services/matchingService';

export function useMatching(shipmentId) {
  return useQuery({
    queryKey: ['matches', shipmentId],
    queryFn: () => matchingService.findMatches(shipmentId),
    enabled: !!shipmentId,
    staleTime: 60 * 1000,
  });
}
