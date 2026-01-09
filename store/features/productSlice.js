import API from '@/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- ASYNC THUNKS (Total 8) ---

// ১. সব প্রোডাক্ট দেখা (Query: ?page=1&limit=12&category=...)
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (queryString = '', { rejectWithValue }) => {
    try {
      const response = await API.get(`/products?${queryString}`);
      return response.data; // Expects: { success, products, pagination }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load products');
    }
  }
);

// ২. স্লাগ দিয়ে প্রোডাক্ট দেখা
export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/details/${slug}`);
      return response.data; // { success, product }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
  }
);

// ৩. রিলেটেড প্রোডাক্ট (CategoryId দিয়ে)
export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelated',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/related/${categoryId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Related load failed');
    }
  }
);

// ৪. সার্চ এবং অ্যাডভান্স ফিল্টার
export const searchProducts = createAsyncThunk(
  'products/search',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const response = await API.get(`/products/search?search=${searchTerm}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

// ৫. প্রোডাক্ট তৈরি করা (Admin)
export const createProduct = createAsyncThunk(
  'products/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Creation failed');
    }
  }
);

// ৬. প্রোডাক্ট আপডেট করা
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// ৭. শুধুমাত্র স্ট্যাটাস পরিবর্তন
export const updateProductStatus = createAsyncThunk(
  'products/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/products/status/${id}`, { status });
      return { id, status: response.data.status || status };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Status update failed');
    }
  }
);

// ৮. প্রোডাক্ট ডিলিট করা
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Delete failed');
    }
  }
);

// --- SLICE ---

const initialState = {
  products: [],
  singleProduct: null,
  relatedProducts: [],
  loading: false,
  btnLoading: false,
  success: false,
  error: null,
  pagination: {
    totalProducts: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 12,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductErrors: (state) => {
      state.error = null;
    },
    resetProductState: (state) => {
      state.success = false;
      state.loading = false;
      state.btnLoading = false;
      state.error = null;
    },
    clearSingleProduct: (state) => {
      state.singleProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Single Product
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.singleProduct = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload.product || action.payload;
      })

      // Related
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload.products || [];
      })

      // Search
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products || [];
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.btnLoading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.btnLoading = false;
        state.success = true;
        if (action.payload.product) state.products.unshift(action.payload.product);
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.btnLoading = false;
        const updated = action.payload.product || action.payload;
        const index = state.products.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.products[index] = updated;
        if (state.singleProduct?._id === updated._id) state.singleProduct = updated;
        state.success = true;
      })

      // Status Update
      .addCase(updateProductStatus.fulfilled, (state, action) => {
        const product = state.products.find((p) => p._id === action.payload.id);
        if (product) product.status = action.payload.status;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearProductErrors, resetProductState, clearSingleProduct } = productSlice.actions;
export default productSlice.reducer;
