import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  user: null,
  users: [],
  addresses: [],
  isAuthenticated: false,
  loading: false,
  error: null,
  isVerified: false,
  successMessage: null,
};

// ---------------------------------------------------------
// --- ASYNC THUNKS (Authentication & Profile) ---
// ---------------------------------------------------------

export const registerUser = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await API.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await API.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;

    return thunkAPI.rejectWithValue({
      message: errorData?.message || 'Login failed',
      isVerified: errorData?.isVerified, 
    });
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await API.post('/api/auth/logout');
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue('Logout failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const response = await API.get('/api/auth/user/profile');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(null);
  }
});

// নতুন: প্রোফাইল আপডেট
export const updateMe = createAsyncThunk('auth/updateMe', async (userData, thunkAPI) => {
  try {
    const response = await API.patch('/api/auth/user/update-me', userData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
  }
});

// ---------------------------------------------------------
// --- ASYNC THUNKS (Address Operations) ---
// ---------------------------------------------------------

export const getAddresses = createAsyncThunk('auth/getAddresses', async (_, thunkAPI) => {
  try {
    const response = await API.get('/api/auth/user/addresses');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch addresses');
  }
});

export const addAddress = createAsyncThunk('auth/addAddress', async (addressData, thunkAPI) => {
  try {
    const response = await API.post('/api/auth/user/addresses', addressData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add address');
  }
});

// নতুন: অ্যাড্রেস আপডেট
export const updateAddress = createAsyncThunk(
  'auth/updateAddress',
  async ({ addressId, addressData }, thunkAPI) => {
    try {
      const response = await API.patch(`/api/auth/user/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

// নতুন: ডিফল্ট অ্যাড্রেস সেট করা
export const setDefaultAddress = createAsyncThunk(
  'auth/setDefaultAddress',
  async (addressId, thunkAPI) => {
    try {
      const response = await API.patch(`/api/auth/user/addresses/${addressId}/set-default`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Action failed');
    }
  }
);

export const deleteAddress = createAsyncThunk('auth/deleteAddress', async (addressId, thunkAPI) => {
  try {
    const response = await API.delete(`/api/auth/user/addresses/${addressId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete address');
  }
});

// ---------------------------------------------------------
// --- ASYNC THUNKS (Admin Operations) ---
// ---------------------------------------------------------

// নতুন: সব ইউজার ফেচ করা
export const getAllUsersAdmin = createAsyncThunk('auth/getAllUsers', async (_, thunkAPI) => {
  try {
    const response = await API.get('/api/auth/users');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
  }
});

// নতুন: ইউজার ডিলিট করা
export const deleteUserAdmin = createAsyncThunk('auth/deleteUser', async (userId, thunkAPI) => {
  try {
    await API.delete(`/api/auth/users/${userId}`);
    return userId; // ডিলিট হওয়া আইডির রেফারেন্স রিটার্ন করা
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed');
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
    resetState: (state) => {
      state.loading = false;
      state.error = null;
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
        state.error = action.payload.message;
        state.isVerified = action.payload.isVerified ?? true;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.successMessage = action.payload.message;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.addresses = [];
        state.users = [];
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(updateMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.successMessage = 'Profile updated!';
      })

      // --- ADDRESS HANDLERS ---
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

      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || [];
        state.successMessage = 'Address added!';
      })

      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses;
      })

      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses || [];
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload.addresses;
      })

      // --- ADMIN HANDLERS ---
      .addCase(getAllUsersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
      })
      .addCase(getAllUsersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUserAdmin.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.successMessage = 'User deleted successfully!';
      });
  },
});

export const { clearError, clearMessage, resetState } = authSlice.actions;
export default authSlice.reducer;
