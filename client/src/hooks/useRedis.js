import { useState, useEffect, useCallback } from 'react';
import { trackingService } from '@/services/trackingService';

/**
 * useRedis
 * Polls the GET /trips/{tripId}/location endpoint which reads from Redis.
 * Used for real-time GPS data when WebSocket is unavailable.
 *
 * @param {string} tripId
 * @param {number} intervalMs - polling interval in ms (default 10000)
 * @returns {{ location, isLoading, error }}
 */
export function useRedis(tripId, intervalMs = 10000) {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocation = useCallback(async () => {
    if (!tripId) return;
    try {
      const data = await trackingService.getLatestLocation(tripId);
      if (data?.latitude && data?.longitude) {
        setLocation(data);
      }
      setError(null);
    } catch (err) {
      // Location key might not exist in Redis yet — not a hard error
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  // Fetch immediately then on interval
  useEffect(() => {
    if (!tripId) { setIsLoading(false); return; }

    fetchLocation();
    const id = setInterval(fetchLocation, intervalMs);
    return () => clearInterval(id);
  }, [tripId, intervalMs, fetchLocation]);

  return { location, isLoading, error, refetch: fetchLocation };
}
