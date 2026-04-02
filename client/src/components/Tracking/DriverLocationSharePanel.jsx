import { useDriverLocationShare } from '@/hooks/useDriverLocationShare';

/**
 * Driver-only: control + status for sending live GPS to the backend (Redis) during IN_TRANSIT.
 */
export function DriverLocationSharePanel({ tripId, tripStatus, isDriver, onPulseSent }) {
  const { shareEnabled, setShareEnabled, sharingActive, error, permissionDenied, gpsAccuracyM } =
    useDriverLocationShare({
    tripId,
    tripStatus,
    isDriver,
    onPulseSent,
  });

  if (!isDriver) return null;

  if (tripStatus !== 'IN_TRANSIT') {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        <p className="font-medium text-gray-800">Driver GPS</p>
        <p className="text-xs mt-1 text-gray-500">
          When the trip moves to <strong>In transit</strong>, you can share live location with dispatch and the shipper.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-teal-900 text-sm flex items-center gap-2">
            <span className="text-lg">📡</span>
            Share live GPS
          </p>
          <p className="text-xs text-teal-800/90 mt-0.5">
            Your position is sent about every 12s while sharing is on. The <strong>map line</strong> connects city centres for context; your <strong>dot</strong> is real GPS and will often sit off that line on the road.
          </p>
        </div>
        <label className="flex items-center gap-2 shrink-0 cursor-pointer select-none">
          <span className="text-xs font-medium text-teal-900">{shareEnabled ? 'On' : 'Off'}</span>
          <button
            type="button"
            role="switch"
            aria-checked={shareEnabled}
            onClick={() => setShareEnabled((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              shareEnabled ? 'bg-teal-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                shareEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>

      {shareEnabled && permissionDenied && (
        <p className="text-xs text-amber-800 bg-amber-100 border border-amber-200 rounded-lg px-3 py-2">
          Location permission denied. Enable location for this site in your browser settings to share GPS.
        </p>
      )}

      {shareEnabled && !permissionDenied && sharingActive && (
        <div className="text-xs text-teal-800 space-y-1">
          <p className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            Sending updates to the server…
          </p>
          {gpsAccuracyM != null && (
            <p className="text-teal-900/80 pl-4">
              Phone reports ~{gpsAccuracyM} m accuracy (outdoors &amp; clear sky is best; Wi‑Fi location is less exact).
            </p>
          )}
        </div>
      )}

      {shareEnabled && !permissionDenied && !sharingActive && !error && (
        <p className="text-xs text-gray-600">Acquiring GPS fix…</p>
      )}

      {error && !permissionDenied && (
        <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}

      {!shareEnabled && (
        <p className="text-xs text-gray-600">Sharing paused — shippers will only see the last cached position until you turn this back on.</p>
      )}
    </div>
  );
}
