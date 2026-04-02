import { useEffect, useRef } from 'react';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon paths broken by bundlers (Vite serves assets from hashed URLs)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const iconColors = {
  truck: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  pickup: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  dropoff: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
};

function makeIcon(type) {
  return L.icon({
    iconUrl: iconColors[type] || iconColors.truck,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

/** Animated truck on the map (movement suggested via motion + route dash animation). */
const truckDivIcon = L.divIcon({
  className: 'map-truck-marker-root',
  html: '<div class="map-truck-marker" aria-hidden="true"><span class="map-truck-emoji">🚛</span></div>',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
});

function iconForMarker(type) {
  if (type === 'truck') return truckDivIcon;
  return makeIcon(type);
}

/**
 * Map component using vanilla Leaflet
 * @param {Array<[number,number]>} polyline - optional [[lat,lng], ...] route line (e.g. city A → city B)
 */
export function Map({
  center = [20.5937, 78.9629],
  zoom = 5,
  markers = [],
  polyline = null,
  className = '',
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const polylineLayerRef = useRef(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(mapRef.current);

    return () => {
      polylineLayerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // eslint-disable-line

  // Polyline (route) + fit bounds
  useEffect(() => {
    if (!mapRef.current) return;

    if (polylineLayerRef.current) {
      mapRef.current.removeLayer(polylineLayerRef.current);
      polylineLayerRef.current = null;
    }

    if (polyline && polyline.length >= 2) {
      const layer = L.polyline(
        polyline.map((p) => [p[0], p[1]]),
        {
          color: '#0d9488',
          weight: 5,
          opacity: 0.92,
          lineJoin: 'round',
          className: 'map-route-animated',
        }
      ).addTo(mapRef.current);
      polylineLayerRef.current = layer;
      try {
        mapRef.current.fitBounds(layer.getBounds(), { padding: [56, 56], maxZoom: 9 });
      } catch {
        /* ignore */
      }
      // Container may have just received height; Leaflet needs a layout pass
      requestAnimationFrame(() => {
        mapRef.current?.invalidateSize();
      });
    }
  }, [polyline]);

  // Update center when not using a polyline
  useEffect(() => {
    if (!mapRef.current) return;
    if (polyline && polyline.length >= 2) return;
    if (center?.[0] && center?.[1]) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom, polyline]);

  // Sync markers
  useEffect(() => {
    if (!mapRef.current) return;

    Object.keys(markersRef.current).forEach((id) => {
      if (!markers.find((m) => m.id === id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    markers.forEach((m) => {
      if (!m.position?.[0] || !m.position?.[1]) return;
      if (markersRef.current[m.id]) {
        markersRef.current[m.id].setLatLng(m.position);
      } else {
        const marker = L.marker(m.position, { icon: iconForMarker(m.type) })
          .addTo(mapRef.current)
          .bindPopup(m.label || m.id);
        markersRef.current[m.id] = marker;
      }
    });
  }, [markers]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[260px] rounded-xl overflow-hidden border border-gray-200 ${className}`}
      style={{ minHeight: 260 }}
    />
  );
}
