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
// --- ASYNC THUNKS (Authentication & Password) ---
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

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, thunkAPI) => {
  try {
    const response = await API.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

// ---------------------------------------------------------
// --- ASYNC THUNKS (User Profile & Addresses) ---
// ---------------------------------------------------------

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const response = await API.get('/auth/user/profile');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(null);
  }
});

export const updateMe = createAsyncThunk('auth/updateMe', async (updateData, thunkAPI) => {
  try {
    const response = await API.patch('/auth/user/update-me', updateData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const getAddresses = createAsyncThunk('auth/getAddresses', async (_, thunkAPI) => {
  try {
    const response = await API.get('/auth/user/addresses');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch addresses');
  }
});

export const addAddress = createAsyncThunk('auth/addAddress', async (addressData, thunkAPI) => {
  try {
    const response = await API.post('/auth/user/addresses', addressData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

// ---------------------------------------------------------
// --- ASYNC THUNKS (Admin Only) ---
// ---------------------------------------------------------

export const getAllUsers = createAsyncThunk('auth/getAllUsers', async (_, thunkAPI) => {
  try {
    const response = await API.get('/auth/users');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const deleteUserByAdmin = createAsyncThunk('auth/deleteUser', async (id, thunkAPI) => {
  try {
    await API.delete(`/auth/users/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
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
      // Authentication
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

      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.users = [];
        state.addresses = [];
        state.isAuthenticated = false;
      })

      // Profile & Me
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.successMessage = 'Profile updated successfully!';
      })

      // Addresses
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses; // assuming backend returns updated list
      })

      // Admin Operations
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(deleteUserByAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
