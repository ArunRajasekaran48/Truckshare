import { useState, useEffect } from 'react';

/**
 * Browser geolocation for driver map: current GPS → destination line.
 * Clears watch on unmount.
 */
export function useDriverBrowserPosition(enabled = true) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !navigator.geolocation) return;

    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPosition([p.coords.latitude, p.coords.longitude]);
      },
      () => setPosition(null),
      { enableHighAccuracy: true, maximumAge: 8000, timeout: 20000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [enabled]);

  return position;
}
