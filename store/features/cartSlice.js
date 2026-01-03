import API from '@/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// --- Async Thunks (ব্যাকএন্ডের সাথে কানেকশনের জন্য) ---

// ১. কার্ট ডাটা আনা
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get(`/cart`);
    return response.data.cart; 
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// ২. কার্টে আইটেম অ্যাড করা
export const addToCartAPI = createAsyncThunk(
  'cart/add',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/add`, productData);
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ৩. কার্ট থেকে আইটেম রিমুভ করা
export const removeFromCartAPI = createAsyncThunk(
  'cart/remove',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/remove`, { productId });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ৪. গেস্ট কার্ট এবং ইউজার কার্ট মার্জ করা (লগইন করার পর)
export const mergeCartAPI = createAsyncThunk(
  'cart/merge',
  async (localItems, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/merge`, { items: localItems });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// --- Initial State ---
const initialState = {
  cartItems:
    typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cartItems')) || [] : [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // গেস্ট ইউজারের জন্য সরাসরি কার্টে অ্যাড (ব্যাকএন্ডে পাঠানোর আগে ফ্রন্টএন্ড আপডেট)
    addToCartLocal: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.productId === item.productId);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.productId === existItem.productId ? { ...x, quantity: x.quantity + item.quantity } : x
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    // কার্ট ক্লিয়ার করা (লগআউটের সময়)
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items || [];
      })
      // Add to Cart API
      .addCase(addToCartAPI.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
      })
      // Remove from Cart API
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
      })
      // Merge Cart
      .addCase(mergeCartAPI.fulfilled, (state, action) => {
        state.cartItems = action.payload.items;
        localStorage.removeItem('cartItems');
      });
  },
});

export const { addToCartLocal, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
