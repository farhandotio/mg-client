import API from '@/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

// ================= ASYNC THUNKS =================

// ১. সব ব্র্যান্ড ফেচ (Public)
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get('/api/brands');
      return response.data.brands || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
    }
  }
);

// ২. নতুন ব্র্যান্ড তৈরি (Admin)
export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post('/api/brands', formData);
      toast.success('Brand created successfully!');
      return response.data.brand || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Create failed');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ৩. ব্র্যান্ড আপডেট (Admin)
export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/api/brands/${id}`, formData);
      toast.success('Brand updated successfully!');
      return response.data.brand || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ৪. ব্র্যান্ড ডিলিট (Admin)
export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/api/brands/${id}`);
      toast.success('Brand deleted successfully!');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ================= SLICE =================

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    loading: false,
    isFetched: false,
    error: null,
  },
  reducers: {
    clearBrandError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH =====
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
        state.isFetched = true;
        state.error = null;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.isFetched = true;
        state.error = action.payload;
      })

      // ===== CREATE =====
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.unshift(action.payload);
      })

      // ===== UPDATE =====
      .addCase(updateBrand.fulfilled, (state, action) => {
        const index = state.brands.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })

      // ===== DELETE =====
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter((b) => b._id !== action.payload);
      });
  },
});

export const { clearBrandError } = brandSlice.actions;
export default brandSlice.reducer;
