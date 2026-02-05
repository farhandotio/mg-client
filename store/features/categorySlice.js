import API from '@/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

// --- Async Thunks ---

// ১. সব ক্যাটাগরি ফেচ করা (Public)
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get(`/api/categories`);
      return response.data.categories || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

// ২. নতুন ক্যাটাগরি তৈরি করা (Admin Only)
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post(`/api/categories`, formData);
      toast.success('Category created successfully!');
      return response.data.category || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Create failed');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ৩. ক্যাটাগরি আপডেট করা (Admin Only)
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`${`/api/categories`}/${id}`, formData);
      toast.success('Category updated successfully!');
      return response.data.category || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// ৪. ক্যাটাগরি ডিলিট করা (Admin Only)
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${`/api/categories`}/${id}`);
      toast.success('Category removed from terminal');
      return id; // স্টেট থেকে রিমুভ করার জন্য ID রিটার্ন করছি
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// --- Slice Configuration ---

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    isFetched: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.isFetched = true;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.isFetched = true;
        state.error = action.payload;
      })

      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })

      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })

      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
