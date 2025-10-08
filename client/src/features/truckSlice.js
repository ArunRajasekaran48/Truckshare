import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as truckService from '../services/truckService';

export const fetchTrucks = createAsyncThunk('truck/fetchTrucks', async ({ from, to, requiredWeight, requiredVolume }) => {
  const response = await truckService.searchTrucks(from, to, requiredWeight, requiredVolume);
  return response.data;
});

export const addTruck = createAsyncThunk('truck/addTruck', async (truckData) => {
  const response = await truckService.addTruck(truckData);
  return response.data;
});

export const updateTruck = createAsyncThunk('truck/updateTruck', async ({ id, truckData }) => {
  const response = await truckService.updateTruck(id, truckData);
  return response.data;
});

export const deleteTruck = createAsyncThunk('truck/deleteTruck', async (id) => {
  await truckService.deleteTruck(id);
  return id;
});

export const fetchTruckById = createAsyncThunk('truck/fetchTruckById', async (id) => {
  const response = await truckService.getTruckById(id);
  return response.data;
});

export const fetchTrucksByOwner = createAsyncThunk('truck/fetchTrucksByOwner', async () => {
  const response = await truckService.getTrucksByOwner();
  return response.data;
});

const truckSlice = createSlice({
  name: 'truck',
  initialState: {
    trucks: [],
    ownerTrucks: [],
    currentTruck: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrucks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrucks.fulfilled, (state, action) => {
        state.loading = false;
        state.trucks = action.payload;
      })
      .addCase(fetchTrucks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTruck.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTruck.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerTrucks.push(action.payload);
      })
      .addCase(addTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTruck.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTruck.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.ownerTrucks.findIndex(truck => truck.id === action.payload.id);
        if (index !== -1) {
          state.ownerTrucks[index] = action.payload;
        }
      })
      .addCase(updateTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTruck.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTruck.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerTrucks = state.ownerTrucks.filter(truck => truck.id !== action.payload);
      })
      .addCase(deleteTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTruckById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTruckById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTruck = action.payload;
      })
      .addCase(fetchTruckById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTrucksByOwner.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrucksByOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.ownerTrucks = action.payload;
      })
      .addCase(fetchTrucksByOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default truckSlice.reducer;