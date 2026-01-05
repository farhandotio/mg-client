import API from '@/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// সেশন আইডি জেনারেট
const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

/**
 * ডাটা ম্যাপ করার হেল্পার
 * এটি নিশ্চিত করে যে ব্যাকএন্ড থেকে আসা ডাটা এবং লোকাল ডাটা একই ফরম্যাটে থাকে।
 */
const mapCartItems = (serverItems) => {
  if (!Array.isArray(serverItems)) return [];

  return serverItems.map((item) => {
    const p = item.product || item;

    // ইমেজ চেক (অ্যারে বা অবজেক্ট হ্যান্ডেলিং)
    let finalImage = '/placeholder.png';
    if (p.images && p.images.length > 0) {
      finalImage = typeof p.images[0] === 'object' ? p.images[0].url : p.images[0];
    } else if (item.image) {
      finalImage = item.image;
    }

    // প্রাইস হ্যান্ডেলিং
    const finalPrice = item.price?.discounted || item.price || p.price?.discounted || p.price || 0;

    return {
      productId: p._id || item.productId || item._id,
      title: p.title || item.title || 'Unknown Neural Unit',
      image: finalImage,
      slug: p.slug || item.slug || '',
      price: Number(finalPrice),
      quantity: Number(item.quantity || 1),
      stock: Number(p.stock || item.stock || 50),
      brand: p.brand?.name || item.brand || 'GENERIC',
    };
  });
};

// --- Async Thunks ---

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await API.get(`/cart?sessionId=${sessionId}`);
    return mapCartItems(response.data.cart?.items || response.data.items);
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Fetch Failed');
  }
});

export const addToCartAPI = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const sessionId = getSessionId();
      const response = await API.post(`/cart/add`, { productId, quantity, sessionId });
      return mapCartItems(response.data.cart?.items || response.data.items);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  'cart/remove',
  async (productId, { rejectWithValue }) => {
    try {
      const sessionId = getSessionId();
      const response = await API.post(`/cart/remove`, { productId, sessionId });
      return mapCartItems(response.data.cart?.items || response.data.items);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const mergeCartAPI = createAsyncThunk('cart/merge', async (_, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await API.post(`/cart/merge`, { sessionId });
    return mapCartItems(response.data.cart?.items || response.data.items);
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const clearCartAPI = createAsyncThunk('cart/clearAPI', async (_, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    await API.delete(`/cart/clear?sessionId=${sessionId}`);
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

// --- Slice Definition ---

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
    addToCartLocal: (state, action) => {
      const { productId, quantity, price, title, image, slug, stock } = action.payload;
      const existingItem = state.cartItems.find((item) => item.productId === productId);
      const safeQty = Number(quantity) || 1;

      if (existingItem) {
        const newQty = existingItem.quantity + safeQty;
        if (newQty <= (existingItem.stock || 50)) {
          existingItem.quantity = newQty;
        }
      } else {
        state.cartItems.push({
          productId,
          title,
          image: image || '/placeholder.png',
          slug,
          stock: stock || 50,
          price: Number(price) || 0,
          quantity: safeQty,
        });
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    updateQuantityLocal: (state, action) => {
      const { productId, delta } = action.payload;
      const item = state.cartItems.find((i) => i.productId === productId);
      if (item) {
        const newQty = item.quantity + delta;
        if (newQty >= 1 && newQty <= (item.stock || 50)) {
          item.quantity = newQty;
          localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }
      }
    },

    removeFromCartLocal: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.productId !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder
      // ১. প্রথমে সব addCase লিখতে হবে
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCartAPI.fulfilled, (state) => {
        state.cartItems = [];
        localStorage.removeItem('cartItems');
      })

      // ২. সব addMatcher থাকবে সবার শেষে
      .addMatcher(
        (action) =>
          action.type.endsWith('/fulfilled') &&
          ['cart/add', 'cart/remove', 'cart/merge'].some((path) => action.type.startsWith(path)),
        (state, action) => {
          state.loading = false;
          state.cartItems = action.payload;
          localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }
      );
  },
});

export const { addToCartLocal, updateQuantityLocal, removeFromCartLocal, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
