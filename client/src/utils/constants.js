export const ROLES = {
  TRUCK_OWNER: 'TRUCK_OWNER',
  BUSINESS_USER: 'BUSINESS_USER',
  DRIVER: 'DRIVER',
};

export const SHIPMENT_STATUS = {
  PENDING: 'PENDING',
  MATCHED: 'MATCHED',
  PARTIALLY_BOOKED: 'PARTIALLY_BOOKED',
  BOOKED: 'BOOKED',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const TRIP_STATUS = {
  PLANNED: 'PLANNED',
  LOADING: 'LOADING',
  IN_TRANSIT: 'IN_TRANSIT',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const TRUCK_STATUS = {
  AVAILABLE: 'AVAILABLE',
  IN_TRANSIT: 'IN_TRANSIT',
  MAINTENANCE: 'MAINTENANCE',
  INACTIVE: 'INACTIVE',
};

export const STATUS_COLORS = {
  // Shipment & Trip statuses
  PENDING: 'bg-slate-100 text-slate-700 border-slate-200',
  // Booking statuses (booking-service)
  PROPOSED: 'bg-slate-100 text-slate-700 border-slate-200',
  MATCHED: 'bg-blue-50 text-blue-700 border-blue-200',
  PARTIALLY_BOOKED: 'bg-amber-50 text-amber-700 border-amber-200',
  BOOKED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  IN_TRANSIT: 'bg-teal-50 text-teal-700 border-teal-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  PLANNED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  LOADING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  // Truck statuses
  AVAILABLE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ON_TRIP: 'bg-teal-50 text-teal-700 border-teal-200',
  UNAVAILABLE: 'bg-slate-100 text-slate-600 border-slate-200',
  MAINTENANCE: 'bg-orange-50 text-orange-700 border-orange-200',
  INACTIVE: 'bg-slate-100 text-slate-500 border-slate-200',
};

export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
  'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Coimbatore', 'Agra', 'Madurai', 'Nashik',
  'Varanasi', 'Meerut', 'Rajkot', 'Srinagar', 'Aurangabad',
  'Chandigarh', 'Amritsar', 'Jodhpur', 'Guwahati', 'Kochi',
];
