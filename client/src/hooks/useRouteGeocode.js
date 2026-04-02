import { useQuery } from '@tanstack/react-query';
import { resolveRouteEndpoints } from '@/services/geocoding';
import { coordsForCityName } from '@/utils/cityCoords';

/**
 * Resolves two place names to a map polyline (static table + optional OSM Nominatim).
 */
export function useRouteGeocode(fromName, toName) {
  return useQuery({
    queryKey: ['routeGeocode', fromName, toName],
    queryFn: () => resolveRouteEndpoints(fromName, toName, coordsForCityName),
    enabled: !!fromName?.trim() && !!toName?.trim(),
    staleTime: 7 * 24 * 60 * 60 * 1000,
    retry: 1,
  });
}
