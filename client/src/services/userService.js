import axiosInstance from '../utils/axiosInstance';

export const login = (userId, password) => {
  return axiosInstance.post('/users/login', { userId, password });
};

export const register = (userData) => {
  return axiosInstance.post('/users/register', userData);
};

export const getUserById = (userId) => {
  return axiosInstance.get(`/users/${userId}`);
};

export const getAllUsers = () => {
  return axiosInstance.get('/users/getAllUsers');
};