import { useState, useEffect, useCallback } from 'react';
import { trackingService } from '@/services/trackingService';

/** Redis / trip-service returns LocationUpdate { lat, lng, timestamp } */
function normalizeLocation(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const lat = raw.latitude ?? raw.lat;
  const lng = raw.longitude ?? raw.lng;
  if (lat == null || lng == null) return null;
  return {
    latitude: Number(lat),
    longitude: Number(lng),
    timestamp: raw.timestamp,
  };
}

export function useTracking(bookingId) {
  const [trip, setTrip] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrip = useCallback(async () => {
    if (!bookingId) return;
    try {
      const data = await trackingService.getTripByBooking(bookingId);
      setTrip(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  const fetchLocation = useCallback(async (tripId) => {
    if (!tripId) return;
    try {
      const loc = await trackingService.getLatestLocation(tripId);
      const normalized = normalizeLocation(loc);
      if (normalized) setLocation(normalized);
    } catch {
      // Location might not exist yet – silently ignore
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  // Poll location every 10 seconds when trip is in transit
  useEffect(() => {
    if (!trip?.id || trip.status !== 'IN_TRANSIT') return;

    fetchLocation(trip.id);
    const interval = setInterval(() => fetchLocation(trip.id), 10000);
    return () => clearInterval(interval);
  }, [trip?.id, trip?.status, fetchLocation]);

  // Poll trip status every 30 seconds
  useEffect(() => {
    if (!bookingId) return;
    const interval = setInterval(fetchTrip, 30000);
    return () => clearInterval(interval);
  }, [bookingId, fetchTrip]);

  const refetchLocation = useCallback(async () => {
    if (trip?.id) await fetchLocation(trip.id);
  }, [trip?.id, fetchLocation]);

  return {
    trip,
    location,
    isLoading,
    error,
    refetch: fetchTrip,
    refetchLocation,
    coordinates: location ? [location.latitude, location.longitude] : null,
  };
}
