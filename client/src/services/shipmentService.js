import api from './api';

export const shipmentService = {
  async create(data) {
    const response = await api.post('/shipments', {
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      requiredWeight: Number(data.requiredWeight),
      requiredVolume: Number(data.requiredVolume),
      requiredLength: Number(data.requiredLength),
      isSplit: data.isSplit || false,
    });
    return response.data;
  },

  async getAll() {
    const response = await api.get('/shipments');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/shipments/${id}`, data);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.put(`/shipments/${id}/status`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  async updateAllocation(id, allocated) {
    const response = await api.put(`/shipments/${id}/allocate`, null, {
      params: {
        allocatedWeight: allocated.weight,
        allocatedVolume: allocated.volume,
        allocatedLength: allocated.length,
      },
    });
    return response.data;
  },

  async isSplittable(id) {
    const response = await api.get(`/shipments/${id}/splittable`);
    return response.data;
  },
};
