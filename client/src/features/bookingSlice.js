import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bookingService from '../services/bookingService';

export const createBooking = createAsyncThunk('booking/createBooking', async (bookingData) => {
  const response = await bookingService.createBooking(bookingData);
  return response.data;
});

export const getAllBookings = createAsyncThunk('booking/getAllBookings', async () => {
  const response = await bookingService.getAllBookings();
  return response.data;
});

export const getBookingById = createAsyncThunk('booking/getBookingById', async (id) => {
  const response = await bookingService.getBookingById(id);
  return response.data;
});

export const acknowledgePayment = createAsyncThunk('booking/acknowledgePayment', async ({ bookingId, paymentReference }) => {
  const response = await bookingService.acknowledgePayment(bookingId, paymentReference);
  return response.data;
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getAllBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(getAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(acknowledgePayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(acknowledgePayment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking && state.currentBooking.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(acknowledgePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default bookingSlice.reducer;