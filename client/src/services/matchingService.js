import api from './api';

export const matchingService = {
  async findMatches(shipmentId) {
    const response = await api.get(`/match/${shipmentId}`);
    return response.data;
  },
};
