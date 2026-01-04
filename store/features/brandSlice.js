import API from '@/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ১. সকল ব্র্যান্ড নিয়ে আসার জন্য (GET)
export const fetchBrands = createAsyncThunk('brands/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await API.get('/brands');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// ২. নতুন ব্র্যান্ড তৈরি (POST - Admin Only)
export const createBrand = createAsyncThunk('brands/create', async (formData, thunkAPI) => {
  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const response = await API.post('/brands', formData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// ৩. ব্র্যান্ড আপডেট করা (PATCH - Admin Only)
export const updateBrand = createAsyncThunk('brands/update', async ({ id, formData }, thunkAPI) => {
  try {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const response = await API.patch(`${'/brands'}/${id}`, formData, config);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// ৪. ব্র্যান্ড ডিলিট করা (DELETE - Admin Only)
export const deleteBrand = createAsyncThunk('brands/delete', async (id, thunkAPI) => {
  try {
    await API.delete(`${'/brands'}/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    isLoading: false,
    isError: false,
    message: '',
  },
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Brands
      .addCase(fetchBrands.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.isLoading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Create Brand
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
      })
      // Update Brand
      .addCase(updateBrand.fulfilled, (state, action) => {
        const index = state.brands.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) state.brands[index] = action.payload;
      })
      // Delete Brand
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter((b) => b._id !== action.payload);
      });
  },
});

export const { resetState } = brandSlice.actions;
export default brandSlice.reducer;
