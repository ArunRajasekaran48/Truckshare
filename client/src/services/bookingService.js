import axiosInstance from '../utils/axiosInstance';

export const createBooking = (bookingData) => {
  return axiosInstance.post('/bookings', bookingData);
};

export const getAllBookings = () => {
  return axiosInstance.get('/bookings/all');
};

export const getBookingById = (id) => {
  return axiosInstance.get(`/bookings/${id}`);
};

export const acknowledgePayment = (bookingId, paymentReference) => {
  return axiosInstance.put(`/bookings/${bookingId}/acknowledge-payment/${paymentReference}`);
};