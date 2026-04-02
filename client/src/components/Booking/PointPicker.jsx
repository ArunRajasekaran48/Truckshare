import { boardingPointsForTruck, droppingPointsForTruck } from '@/utils/truckPoints';

/**
 * @param {Object} truck - truck with optional points[]
 * @param {{ boardingPointId?: string, droppingPointId?: string }} value
 * @param {Function} onChange - (next: value) => void
 */
export function PointPicker({ truck, value = {}, onChange }) {
  const boarding = boardingPointsForTruck(truck);
  const dropping = droppingPointsForTruck(truck);
  if (boarding.length === 0 && dropping.length === 0) return null;

  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-3 pt-2 border-t border-gray-100">
      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pickup &amp; delivery stops</p>
      {boarding.length > 0 && (
        <div>
          <label className="label text-xs">Boarding</label>
          <select
            className="input-field text-sm"
            value={value.boardingPointId || ''}
            onChange={(e) => set({ boardingPointId: e.target.value || undefined })}
            required
          >
            <option value="">Select boarding stop…</option>
            {boarding.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.scheduledTime ? ` · ${p.scheduledTime}` : ''}
                {p.address ? ` — ${p.address}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}
      {dropping.length > 0 && (
        <div>
          <label className="label text-xs">Dropping</label>
          <select
            className="input-field text-sm"
            value={value.droppingPointId || ''}
            onChange={(e) => set({ droppingPointId: e.target.value || undefined })}
            required
          >
            <option value="">Select dropping stop…</option>
            {dropping.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.scheduledTime ? ` · ${p.scheduledTime}` : ''}
                {p.address ? ` — ${p.address}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
