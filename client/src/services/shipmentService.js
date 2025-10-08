import axiosInstance from '../utils/axiosInstance';

export const createShipment = (shipmentData) => {
  return axiosInstance.post('/shipments', shipmentData);
};

export const getShipmentById = (id) => {
  return axiosInstance.get(`/shipments/${id}`);
};

export const updateShipment = (id, shipmentData) => {
  return axiosInstance.put(`/shipments/${id}`, shipmentData);
};

export const updateShipmentStatus = (id, status) => {
  return axiosInstance.put(`/shipments/${id}/status`, status);
};

export const updateAllocation = (shipmentId, allocatedWeight, allocatedVolume) => {
  return axiosInstance.put(`/shipments/${shipmentId}/allocate`, null, {
    params: { allocatedWeight, allocatedVolume },
  });
};

export const getShipmentsByUser = () => {
  return axiosInstance.get('/shipments');
};

export const isSplittable = (shipmentId) => {
  return axiosInstance.get(`/shipments/${shipmentId}/splittable`);
};