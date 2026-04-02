/**
 * Resolve place names to [lat, lng] for maps.
 * 1) Static table (fast, offline)
 * 2) OpenStreetMap Nominatim (any town/village in India — rate-limited ~1 req/s)
 */

const memoryCache = new Map();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export function normalizeKey(name) {
  return (name || '').trim().toLowerCase();
}

/** @returns {Promise<[number, number] | null>} */
export async function fetchNominatimPlace(name) {
  if (!name?.trim()) return null;
  const key = normalizeKey(name);
  if (memoryCache.has(key)) return memoryCache.get(key);

  const q = `${name.trim()}, India`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.[0]) return null;
  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  const coord = [lat, lon];
  memoryCache.set(key, coord);
  return coord;
}

/**
 * Full route: static coords first; Nominatim only for unknown names.
 * Respects Nominatim ~1 req/s when two network lookups are needed.
 */
export async function resolveRouteEndpoints(fromName, toName, coordsForCityNameSync) {
  if (!fromName?.trim() || !toName?.trim()) return null;

  const needNetA = !coordsForCityNameSync(fromName);
  const needNetB = !coordsForCityNameSync(toName);

  let a = coordsForCityNameSync(fromName);
  if (!a) {
    a = await fetchNominatimPlace(fromName);
  }
  if (!a) return null;

  if (needNetA && needNetB) await sleep(1100);

  let b = coordsForCityNameSync(toName);
  if (!b) {
    if (needNetB && !needNetA) await sleep(1100);
    b = await fetchNominatimPlace(toName);
  }
  if (!b) return null;

  return {
    from: a,
    to: b,
    polyline: [a, b],
  };
}

/** Single destination point for “you → drop” maps (static + Nominatim). */
export async function resolveDestination(toName, coordsForCityNameSync) {
  if (!toName?.trim()) return null;
  let b = coordsForCityNameSync(toName);
  if (!b) b = await fetchNominatimPlace(toName);
  if (!b) return null;
  return { to: b };
}
