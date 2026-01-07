import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  user: null,
  users: [],
  addresses: [],
  isAuthenticated: false,
  loading: false,
  error: null,
  successMessage: null,
};

// ---------------------------------------------------------
// --- ASYNC THUNKS (Authentication) ---
// ---------------------------------------------------------

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await API.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await API.post('/auth/logout');
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue('Logout failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const response = await API.get('/auth/user/profile');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(null);
  }
});

// ---------------------------------------------------------
// --- ASYNC THUNKS (Address Operations) ---
// ---------------------------------------------------------

export const getAddresses = createAsyncThunk('auth/getAddresses', async (_, thunkAPI) => {
  try {
    const response = await API.get('/auth/user/addresses');
    return response.data; // Expected { addresses: [...] }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
  }
});

export const addAddress = createAsyncThunk('auth/addAddress', async (addressData, thunkAPI) => {
  try {
    const response = await API.post('/auth/user/addresses', addressData);
    return response.data; // Expected { addresses: [...] }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add address');
  }
});

export const deleteAddress = createAsyncThunk('auth/deleteAddress', async (addressId, thunkAPI) => {
  try {
    const response = await API.delete(`/auth/user/addresses/${addressId}`);
    return response.data; // Expected { addresses: [...] }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete address');
  }
});

// ---------------------------------------------------------
// --- SLICE DEFINITION ---
// ---------------------------------------------------------

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.addresses = [];
        state.isAuthenticated = false;
        state.loading = false;
      })

      // Get Me (Profile Check)
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // --- ADDRESS HANDLERS ---

      // Get Addresses
      .addCase(getAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses || [];
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        // ব্যাকএন্ড থেকে আসা নতুন অ্যাড্রেস লিস্ট দিয়ে স্টেট আপডেট
        state.addresses = action.payload.addresses || [];
        state.successMessage = 'Address added successfully!';
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || [];
        state.successMessage = 'Address deleted!';
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
