/**
 * LocationMarker
 * Renders a styled Leaflet marker — used inside <Map> via imperative API.
 * This module exports a helper that creates a Leaflet DivIcon for each marker type.
 *
 * Usage (inside Map.jsx imperative code):
 *   import { createMarkerIcon } from './LocationMarker';
 *   L.marker(pos, { icon: createMarkerIcon('truck') }).addTo(map);
 */

const markerStyles = {
  truck: {
    bg: '#0d9488',       // teal-600
    emoji: '🚛',
    label: 'Truck',
  },
  pickup: {
    bg: '#16a34a',       // green-600
    emoji: '📦',
    label: 'Pickup',
  },
  dropoff: {
    bg: '#dc2626',       // red-600
    emoji: '🏁',
    label: 'Dropoff',
  },
};

/**
 * Creates a Leaflet DivIcon for use with L.marker.
 * @param {'truck'|'pickup'|'dropoff'} type
 * @returns {L.DivIcon | null}
 */
export function createMarkerIcon(type) {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line no-undef
  const L = window.L || require('leaflet');
  if (!L) return null;

  const style = markerStyles[type] || markerStyles.truck;

  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${style.bg};
        width:36px;height:36px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
        border:2px solid white;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
      ">
        <span style="transform:rotate(45deg);font-size:16px;line-height:1">${style.emoji}</span>
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
}

/**
 * LocationMarker (React component — informational/display only)
 * Used in TrackingInfo sidebar to show marker legend.
 */
export function LocationMarker({ type = 'truck', label }) {
  const style = markerStyles[type] || markerStyles.truck;
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0 text-white"
        style={{ background: style.bg }}
      >
        {style.emoji}
      </div>
      <span className="text-sm text-gray-700">{label || style.label}</span>
    </div>
  );
}
