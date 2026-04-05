import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/users/register', {
      userId: userData.userId,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: userData.role,
    });
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/users/login', {
      userId: credentials.userId,
      password: credentials.password,
    });
    const { token, tokenType, role } = response.data;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', credentials.userId);
    localStorage.setItem('userRole', role);
    return response.data;
  },

  async getUser(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async getDrivers() {
    const response = await api.get('/users/role/DRIVER');
    return response.data;
  },

  async updateDriverAvailability(userId, status) {
    const response = await api.put(`/users/${userId}/driver-availability`, null, {
      params: { status },
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  },
};
