import axiosInstance from '../utils/axiosInstance';

export const getMatches = (shipmentId) => {
  return axiosInstance.get(`/match/${shipmentId}`);
};