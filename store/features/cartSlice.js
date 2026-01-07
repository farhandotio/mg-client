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
 * ডাটা ম্যাপ করার হেল্পার (Fixed logic for IDs and Prices)
 */
const mapCartItems = (serverItems) => {
  if (!Array.isArray(serverItems)) return [];

  return serverItems.map((item) => {
    const p = item.product || item.productId || item;
    const rawId = p._id || item.productId || item._id;
    const finalId = typeof rawId === 'object' ? rawId.toString() : String(rawId);

    let finalImage = '/placeholder.png';
    const rawImages = p.images || item.images || [];
    if (Array.isArray(rawImages) && rawImages.length > 0) {
      finalImage = typeof rawImages[0] === 'object' ? rawImages[0].url : rawImages[0];
    } else if (p.image || item.image) {
      finalImage = p.image || item.image;
    }

    const getPrice = (obj) => {
      if (typeof obj === 'object' && obj !== null) {
        return obj.discounted || obj.regular || obj.price || 0;
      }
      return Number(obj) || 0;
    };

    const finalPrice = getPrice(item.price) || getPrice(p.price) || 0;

    return {
      productId: finalId,
      title: p.title || item.title || 'Neural Unit',
      image: finalImage,
      slug: p.slug || item.slug || '',
      price: Number(finalPrice),
      quantity: Number(item.quantity || 1),
      stock: Number(p.stock || item.stock || 50),
      brand: (typeof p.brand === 'object' ? p.brand?.name : p.brand) || 'GENERIC',
    };
  });
};

// --- Async Thunks ---

// ১. কার্ট ডাটা ফেচ করা
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await API.get(`/cart?sessionId=${sessionId}`);
    const items = response.data.cart?.items || response.data.items || [];
    return mapCartItems(items);
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Fetch Failed');
  }
});

// ২. সরাসরি প্লাস/মাইনাস একশন পাঠানো (নতুন কন্ট্রোলার অনুযায়ী)
export const updateCartQuantityAPI = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, action, sessionId }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/cart/update`, { productId, action, sessionId });
      const items = response.data.cart?.items || [];
      return mapCartItems(items);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ৩. অ্যাড টু কার্ট (পরিমান সহ যোগ করা)
export const addToCartAPI = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const sessionId = getSessionId();
      const idToSend = typeof productId === 'object' ? productId._id : productId;
      const response = await API.post(`/cart/add`, { productId: idToSend, quantity, sessionId });
      const items = response.data.cart?.items || response.data.items || [];
      return mapCartItems(items);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ৪. রিমুভ ফ্রম কার্ট
export const removeFromCartAPI = createAsyncThunk(
  'cart/remove',
  async (productId, { rejectWithValue }) => {
    try {
      const sessionId = getSessionId();
      const response = await API.post(`/cart/remove`, { productId, sessionId });
      const items = response.data.cart?.items || response.data.items || [];
      return mapCartItems(items);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// ৫. মার্জ কার্ট
export const mergeCartAPI = createAsyncThunk('cart/merge', async (_, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await API.post(`/cart/merge`, { sessionId });
    const items = response.data.cart?.items || response.data.items || [];
    return mapCartItems(items);
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

// --- Slice Definition ---

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart: (state) => {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cartItems');
        if (saved) state.cartItems = JSON.parse(saved);
      }
    },
    updateQuantityLocal: (state, action) => {
      const { productId, delta } = action.payload;
      const item = state.cartItems.find((i) => String(i.productId) === String(productId));
      if (item) {
        const newQty = item.quantity + delta;
        if (newQty >= 1) {
          item.quantity = newQty;
          localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        }
      }
    },
    removeFromCartLocal: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => String(item.productId) !== String(action.payload)
      );
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && action.type.startsWith('cart/'),
        (state, action) => {
          if (Array.isArray(action.payload)) {
            state.loading = false;
            state.cartItems = action.payload;
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
          }
        }
      );
  },
});

export const { addToCartLocal, updateQuantityLocal, removeFromCartLocal, clearCart, hydrateCart } =
  cartSlice.actions;
export default cartSlice.reducer;
