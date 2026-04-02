import { useQuery } from '@tanstack/react-query';
import { resolveDestination } from '@/services/geocoding';
import { coordsForCityName } from '@/utils/cityCoords';

/** Resolves drop-off place name to map coordinates (static table + optional OSM Nominatim). */
export function useDestinationGeocode(toName) {
  return useQuery({
    queryKey: ['destGeocode', toName],
    queryFn: () => resolveDestination(toName, coordsForCityName),
    enabled: !!toName?.trim(),
    staleTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });
}
