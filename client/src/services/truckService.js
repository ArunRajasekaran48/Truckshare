import axiosInstance from '../utils/axiosInstance';

export const searchTrucks = (from, to, requiredWeight, requiredVolume) => {
  return axiosInstance.get('/trucks/search', {
    params: { from, to, requiredWeight, requiredVolume },
  });
};

export const addTruck = (truckData) => {
  return axiosInstance.post('/trucks/add-truck', truckData);
};

export const updateTruck = (id, truckData) => {
  return axiosInstance.put(`/trucks/update/${id}`, truckData);
};

export const deleteTruck = (id) => {
  return axiosInstance.delete(`/trucks/delete/${id}`);
};

export const getTruckById = (id) => {
  return axiosInstance.get(`/trucks/${id}`);
};

export const getTrucksByOwner = () => {
  return axiosInstance.get('/trucks/getTrucksByOwner');
};

export const getAvailableTrucks = () => {
  return axiosInstance.get('/trucks/available-trucks');
};

export const updateCapacity = (id, bookedWeight, bookedVolume) => {
  return axiosInstance.put(`/trucks/update-capacity/${id}`, null, {
    params: { bookedWeight, bookedVolume },
  });
};

export const updateStatus = (id, status) => {
  return axiosInstance.put(`/trucks/${id}/update-status`, null, {
    params: { status },
  });
};