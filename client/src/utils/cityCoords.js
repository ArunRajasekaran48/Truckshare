/**
 * Approximate centroids for Indian places (dropdown + common towns).
 * Also supports case-insensitive match and common spelling variants.
 */
export const CITY_COORDS = {
  Mumbai: [19.076, 72.8777],
  Delhi: [28.6139, 77.209],
  Bangalore: [12.9716, 77.5946],
  Hyderabad: [17.385, 78.4867],
  Ahmedabad: [23.0225, 72.5714],
  Chennai: [13.0827, 80.2707],
  Kolkata: [22.5726, 88.3639],
  Surat: [21.1702, 72.8311],
  Pune: [18.5204, 73.8567],
  Jaipur: [26.9124, 75.7873],
  Lucknow: [26.8467, 80.9462],
  Kanpur: [26.4499, 80.3319],
  Nagpur: [21.1458, 79.0882],
  Indore: [22.7196, 75.8577],
  Thane: [19.2183, 72.9781],
  Bhopal: [23.2599, 77.4126],
  Visakhapatnam: [17.6868, 83.2185],
  Patna: [25.5941, 85.1376],
  Vadodara: [22.3072, 73.1812],
  Ghaziabad: [28.6692, 77.4538],
  Ludhiana: [30.901, 75.8573],
  Coimbatore: [11.0168, 76.9558],
  Agra: [27.1767, 78.0081],
  Madurai: [9.9252, 78.1198],
  Nashik: [19.9975, 73.7898],
  Varanasi: [25.3176, 82.9739],
  Meerut: [28.9845, 77.7064],
  Rajkot: [22.3039, 70.8022],
  Srinagar: [34.0837, 74.7973],
  Aurangabad: [19.8762, 75.3433],
  Chandigarh: [30.7333, 76.7794],
  Amritsar: [31.634, 74.8723],
  Jodhpur: [26.2389, 73.0243],
  Guwahati: [26.1445, 91.7362],
  Kochi: [9.9312, 76.2673],
  /** Tamil Nadu — common shipment lanes */
  Thiruvannamalai: [12.2253, 79.0747],
  Tiruvannamalai: [12.2253, 79.0747],
};

/** Alternate spellings → canonical key in CITY_COORDS */
const ALIASES = {
  thiruvannamalai: 'Thiruvannamalai',
  tiruvannamalai: 'Thiruvannamalai',
  coimbatore: 'Coimbatore',
  bengaluru: 'Bangalore',
};

export function coordsForCityName(name) {
  if (!name || typeof name !== 'string') return null;
  const trimmed = name.trim();
  if (!trimmed) return null;

  if (CITY_COORDS[trimmed]) return CITY_COORDS[trimmed];

  const alias = ALIASES[trimmed.toLowerCase()];
  if (alias && CITY_COORDS[alias]) return CITY_COORDS[alias];

  const lower = trimmed.toLowerCase();
  const found = Object.keys(CITY_COORDS).find((k) => k.toLowerCase() === lower);
  if (found) return CITY_COORDS[found];

  return null;
}

/** Shipment or truck { fromLocation, toLocation } — uses static table only */
export function routeCoordsForLocations(entity) {
  if (!entity?.fromLocation || !entity?.toLocation) return null;
  const a = coordsForCityName(entity.fromLocation);
  const b = coordsForCityName(entity.toLocation);
  if (!a || !b) return null;
  return { from: a, to: b, polyline: [a, b] };
}

/** @deprecated use routeCoordsForLocations — kept for older imports */
export function routeCoordsForTruck(truck) {
  return routeCoordsForLocations(truck);
}
