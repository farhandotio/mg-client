import API from '@/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

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
        return obj.discounted || obj.regular || obj.base || obj.price || 0;
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

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const sessionId = getSessionId();
    const response = await API.get(`/api/cart?sessionId=${sessionId}`);
    const items = response.data.cart?.items || response.data.items || [];
    return mapCartItems(items);
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Fetch Failed');
  }
});

export const updateCartQuantityAPI = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, action, sessionId }, { rejectWithValue }) => {
    try {
      const response = await API.post(`/api/cart/update`, { productId, action, sessionId });
      const items = response.data.cart?.items || [];
      return mapCartItems(items);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const addToCartAPI = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const sessionId = getSessionId();
      const idToSend = typeof productId === 'object' ? productId._id : productId;
      const response = await API.post(`/api/cart/add`, { productId: idToSend, quantity, sessionId });
      toast.success('Unit added to neural core');
      const items = response.data.cart?.items || response.data.items || [];
      return mapCartItems(items);
    } catch (error) {
      toast.error('Sync failed');
      return rejectWithValue(error.response?.data);
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  'cart/remove',
  async (productId, { rejectWithValue }) => {
    try {
      const sessionId = getSessionId();
      const response = await API.post(`/api/cart/remove`, { productId, sessionId });
      const items = response.data.cart?.items || response.data.items || [];
      return mapCartItems(items);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

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
    // এই ফাংশনটি এখন যুক্ত করা হলো যা আগে ছিল না
    addToCartLocal: (state, action) => {
      const product = action.payload;
      const existingItem = state.cartItems.find(
        (item) => String(item.productId) === String(product._id)
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const mapped = mapCartItems([product])[0];
        state.cartItems.push(mapped);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
      toast.success('Unit saved to local cache');
    },
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
      toast.error('Unit purged');
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
