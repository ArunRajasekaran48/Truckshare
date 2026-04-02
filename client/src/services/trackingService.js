import api from './api';

export const trackingService = {
  async getTripByBooking(bookingId) {
    const response = await api.get(`/trips/booking/${bookingId}`);
    return response.data;
  },

  async getTripById(tripId) {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },

  async updateStatus(tripId, status) {
    const response = await api.put(`/trips/${tripId}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  async updateStatusByBooking(bookingId, status) {
    const response = await api.put(`/trips/booking/${bookingId}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  /** Matches trip-service LocationUpdate: lat, lng, timestamp (Instant) */
  async sendLocation(tripId, coords) {
    const response = await api.post(`/trips/${tripId}/pulse`, {
      lat: coords.lat ?? coords.latitude,
      lng: coords.lng ?? coords.longitude,
      timestamp: new Date().toISOString(),
    });
    return response.data;
  },

  async getLatestLocation(tripId) {
    const response = await api.get(`/trips/${tripId}/location`);
    return response.data;
  },
};
