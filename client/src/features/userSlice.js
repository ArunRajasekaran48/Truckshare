import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../services/userService';

export const login = createAsyncThunk('user/login', async ({ userId, password }) => {
  const response = await userService.login(userId, password);
  return response.data;
});

export const register = createAsyncThunk('user/register', async (userData) => {
  const response = await userService.register(userData);
  return response.data;
});

export const getUserById = createAsyncThunk('user/getUserById', async (userId) => {
  const response = await userService.getUserById(userId);
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally handle post-registration
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, setToken } = userSlice.actions;
export default userSlice.reducer;