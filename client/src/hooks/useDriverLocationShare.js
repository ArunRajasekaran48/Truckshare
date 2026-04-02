import { useEffect, useRef, useState, useCallback } from 'react';
import { trackingService } from '@/services/trackingService';

/** Minimum time between POST /trips/:id/pulse (matches viewer poll ~10s) */
const MIN_INTERVAL_MS = 12000;

/**
 * For drivers only: stream device GPS to trip-service → Redis while trip is IN_TRANSIT.
 * Uses watchPosition + throttled pulses. Toggle off to pause (privacy / battery).
 */
export function useDriverLocationShare({ tripId, tripStatus, isDriver, onPulseSent }) {
  const [shareEnabled, setShareEnabled] = useState(true);
  const [sharingActive, setSharingActive] = useState(false);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  /** Browser-reported GPS uncertainty (meters); null if unknown */
  const [gpsAccuracyM, setGpsAccuracyM] = useState(null);
  const watchIdRef = useRef(null);
  const lastSentRef = useRef(0);

  const sendPulse = useCallback(
    async (lat, lng) => {
      if (!tripId) return;
      const now = Date.now();
      if (now - lastSentRef.current < MIN_INTERVAL_MS) return;
      lastSentRef.current = now;
      try {
        await trackingService.sendLocation(tripId, { lat, lng });
        setSharingActive(true);
        setError(null);
        onPulseSent?.();
      } catch (e) {
        setError(e.message || 'Could not send location');
        setSharingActive(false);
      }
    },
    [tripId, onPulseSent]
  );

  useEffect(() => {
    setPermissionDenied(false);
    setError(null);

    if (!isDriver || tripStatus !== 'IN_TRANSIT' || !shareEnabled || !tripId) {
      if (watchIdRef.current != null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setSharingActive(false);
      setGpsAccuracyM(null);
      return;
    }

    if (!navigator.geolocation) {
      setError('This browser does not support GPS.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPermissionDenied(false);
        if (typeof pos.coords.accuracy === 'number' && !Number.isNaN(pos.coords.accuracy)) {
          setGpsAccuracyM(Math.round(pos.coords.accuracy));
        }
        sendPulse(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        if (err.code === 1) {
          setPermissionDenied(true);
          setSharingActive(false);
        }
        setError(err.message || 'Location error');
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 30000,
      }
    );

    return () => {
      if (watchIdRef.current != null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isDriver, tripStatus, shareEnabled, tripId, sendPulse]);

  return {
    shareEnabled,
    setShareEnabled,
    sharingActive,
    error,
    permissionDenied,
    gpsAccuracyM,
  };
}
