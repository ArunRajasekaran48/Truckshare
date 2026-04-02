import api from './api';

export const bookingService = {
  async create(data) {
    const response = await api.post('/bookings', {
      shipmentId: data.shipmentId,
      truckId: data.truckId,
      allocatedWeight: data.allocatedWeight,
      allocatedVolume: data.allocatedVolume,
      allocatedLength: data.allocatedLength,
      boardingPointId: data.boardingPointId || null,
      droppingPointId: data.droppingPointId || null,
    });
    return response.data;
  },

  async getAll() {
    const response = await api.get('/bookings/all');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  async acknowledgePayment(id, paymentReference) {
    const response = await api.put(
      `/bookings/${id}/acknowledge-payment/${paymentReference}`
    );
    return response.data;
  },

  async cancel(id) {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};
