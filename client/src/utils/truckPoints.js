/**
 * Boarding / dropping stops on trucks (matches backend PointType BOARDING | DROPPING).
 */

export function boardingPointsForTruck(truck) {
  return (truck?.points || []).filter((p) => p.type === 'BOARDING');
}

export function droppingPointsForTruck(truck) {
  return (truck?.points || []).filter((p) => p.type === 'DROPPING');
}

/** Display label for a saved stop id (matches truck.points[].id). */
export function pointLabelForId(truck, pointId) {
  if (!pointId || !truck?.points?.length) return null;
  const idStr = String(pointId);
  const p = truck.points.find((x) => String(x.id) === idStr);
  if (!p) return null;
  const name = (p.name || '').trim();
  const addr = (p.address || '').trim();
  if (name && addr) return `${name} — ${addr}`;
  return name || addr || null;
}

/**
 * @param {Array} trucks - selected trucks (with optional points[])
 * @param {Record<string, { boardingPointId?: string, droppingPointId?: string }>} selections - keyed by truck id
 * @returns {string|null} error message or null if OK
 */
export function validateTruckPointSelections(trucks, selections) {
  for (const t of trucks) {
    const boarding = boardingPointsForTruck(t);
    const dropping = droppingPointsForTruck(t);
    const sel = selections[t.id] || {};
    if (boarding.length && !sel.boardingPointId) {
      return `Select a boarding stop for ${t.model || 'the truck'}.`;
    }
    if (dropping.length && !sel.droppingPointId) {
      return `Select a dropping stop for ${t.model || 'the truck'}.`;
    }
  }
  return null;
}
