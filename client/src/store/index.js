import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import truckReducer from '../features/truckSlice';
import shipmentReducer from '../features/shipmentSlice';
import bookingReducer from '../features/bookingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    truck: truckReducer,
    shipment: shipmentReducer,
    booking: bookingReducer,
  },
});