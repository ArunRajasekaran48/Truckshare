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
  PENDING: 'bg-gray-100 text-gray-700 border-gray-200',
  // Booking statuses (booking-service)
  PROPOSED: 'bg-gray-100 text-gray-700 border-gray-200',
  MATCHED: 'bg-blue-100 text-blue-700 border-blue-200',
  PARTIALLY_BOOKED: 'bg-amber-100 text-amber-700 border-amber-200',
  BOOKED: 'bg-green-100 text-green-700 border-green-200',
  IN_TRANSIT: 'bg-teal-100 text-teal-700 border-teal-200',
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
  PLANNED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  LOADING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  // Truck statuses
  AVAILABLE: 'bg-green-100 text-green-700 border-green-200',
  ON_TRIP: 'bg-teal-100 text-teal-700 border-teal-200',
  UNAVAILABLE: 'bg-gray-100 text-gray-600 border-gray-200',
  MAINTENANCE: 'bg-orange-100 text-orange-700 border-orange-200',
  INACTIVE: 'bg-gray-100 text-gray-500 border-gray-200',
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
