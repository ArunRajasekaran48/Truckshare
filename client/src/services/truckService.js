import api from './api';

export const truckService = {
  async addTruck(data) {
    const response = await api.post('/trucks/add-truck', data);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/trucks/${id}`);
    return response.data;
  },

  async getTrucksByOwner() {
    const response = await api.get('/trucks/getTrucksByOwner');
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/trucks/update/${id}`, data);
    return response.data;
  },

  async deleteTruck(id) {
    const response = await api.delete(`/trucks/delete/${id}`);
    return response.data;
  },

  async search(params) {
    const response = await api.get('/trucks/search', { params });
    return response.data;
  },

  async splitSearch(params) {
    const response = await api.get('/trucks/split-search', { params });
    return response.data;
  },

  /** Truck assigned to this driver (404 → no assignment yet) */
  async getAssignedTruck(driverId) {
    try {
      const response = await api.get(`/trucks/assigned-to/${driverId}`);
      return response.data;
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  },

  async assignDriver(truckId, driverId, driverName) {
    const response = await api.put(`/trucks/${truckId}/assign-driver`, null, {
      params: { driverId, driverName },
    });
    return response.data;
  },

  async unassignDriver(truckId) {
    const response = await api.put(`/trucks/${truckId}/unassign-driver`);
    return response.data;
  },
};
