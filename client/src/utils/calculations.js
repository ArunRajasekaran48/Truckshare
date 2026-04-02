/**
 * calculations.js
 * Reusable business-logic calculations for capacity and cost.
 */

/**
 * Calculate estimated booking cost for a single truck + allocation.
 * Cost = (allocatedWeight × pricePerKg) + (allocatedLength × pricePerLength)
 */
export function calcBookingCost(truck, allocation) {
  if (!truck || !allocation) return 0;
  const weightCost = (allocation.weight || 0) * (truck.pricePerKg || 0);
  const lengthCost = (allocation.length || 0) * (truck.pricePerLength || 0);
  return weightCost + lengthCost;
}

/**
 * Calculate total cost across multiple truck/allocation pairs.
 * @param {Array} trucks        - array of truck objects
 * @param {Object} allocation   - { [truckId]: { weight, volume, length } }
 */
export function calcTotalCost(trucks = [], allocation = {}) {
  return trucks.reduce((sum, t) => sum + calcBookingCost(t, allocation[t.id]), 0);
}

/**
 * Capacity utilisation percentage (0–100).
 */
export function utilizationPct(used, total) {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((used / total) * 100));
}

/**
 * Check whether an allocation satisfies the shipment requirements.
 * @param {Object} totals   - { weight, volume, length } summed across trucks
 * @param {Object} required - { requiredWeight, requiredVolume, requiredLength }
 */
export function isAllocationValid(totals, required) {
  return (
    (totals.weight || 0) >= (required.requiredWeight || 0) &&
    (totals.volume || 0) >= (required.requiredVolume || 0) &&
    (totals.length || 0) >= (required.requiredLength || 0)
  );
}

/**
 * Sum up an allocation map.
 * @param {Object} allocation - { [truckId]: { weight, volume, length } }
 */
export function sumAllocation(allocation = {}) {
  return Object.values(allocation).reduce(
    (sum, a) => ({
      weight: sum.weight + (a.weight || 0),
      volume: sum.volume + (a.volume || 0),
      length: sum.length + (a.length || 0),
    }),
    { weight: 0, volume: 0, length: 0 }
  );
}

/**
 * Returns how much capacity is still unallocated for a shipment.
 */
export function remainingCapacity(shipment, allocation = {}) {
  const totals = sumAllocation(allocation);
  return {
    weight: Math.max(0, (shipment.requiredWeight || 0) - totals.weight),
    volume: Math.max(0, (shipment.requiredVolume || 0) - totals.volume),
    length: Math.max(0, (shipment.requiredLength || 0) - totals.length),
  };
}
