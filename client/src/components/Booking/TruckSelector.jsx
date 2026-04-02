import { TruckCard } from '@/components/Truck/TruckCard';

export function TruckSelector({ trucks = [], selectedIds = [], onToggle, splittable }) {
  if (!trucks.length) return (
    <p className="text-sm text-gray-400 text-center py-8">No matching trucks found.</p>
  );

  return (
    <div className="space-y-3">
      {!splittable && (
        <p className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          This is a non-splittable shipment. Select exactly one truck.
        </p>
      )}
      <p className="text-xs text-gray-500">
        If a truck has boarding or dropping stops defined by the owner, you will choose them at confirmation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trucks.map((truck) => {
          const selected = selectedIds.includes(truck.id);
          return (
            <div
              key={truck.id}
              className={`relative rounded-xl border-2 transition-all cursor-pointer ${
                selected ? 'border-teal-600 shadow-md' : 'border-transparent'
              }`}
              onClick={() => {
                if (!splittable) {
                  onToggle(selected ? [] : [truck.id]);
                } else {
                  onToggle(
                    selected
                      ? selectedIds.filter((id) => id !== truck.id)
                      : [...selectedIds, truck.id]
                  );
                }
              }}
            >
              {selected && (
                <span className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              )}
              <TruckCard truck={truck} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
