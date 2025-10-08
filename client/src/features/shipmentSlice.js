import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as shipmentService from '../services/shipmentService';

export const createShipment = createAsyncThunk('shipment/createShipment', async (shipmentData) => {
  const response = await shipmentService.createShipment(shipmentData);
  return response.data;
});

export const updateShipment = createAsyncThunk('shipment/updateShipment', async ({ id, shipmentData }) => {
  const response = await shipmentService.updateShipment(id, shipmentData);
  return response.data;
});

export const getShipmentById = createAsyncThunk('shipment/getShipmentById', async (id) => {
  const response = await shipmentService.getShipmentById(id);
  return response.data;
});

const shipmentSlice = createSlice({
  name: 'shipment',
  initialState: {
    shipments: [],
    currentShipment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentShipment: (state) => {
      state.currentShipment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments.push(action.payload);
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateShipment.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shipments.findIndex(shipment => shipment.id === action.payload.id);
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
        if (state.currentShipment && state.currentShipment.id === action.payload.id) {
          state.currentShipment = action.payload;
        }
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getShipmentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getShipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShipment = action.payload;
      })
      .addCase(getShipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentShipment } = shipmentSlice.actions;
export default shipmentSlice.reducer;