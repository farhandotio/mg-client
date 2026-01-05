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
 * ব্যাকএন্ডের পপুলেটেড ডাটা এবং লোকাল ডাটার মধ্যে সামঞ্জস্য বজায় রাখে
 */
const mapCartItems = (serverItems) => {
  if (!Array.isArray(serverItems)) return [];

  return serverItems.map((item) => {
    // পপুলেটেড ডাটা হ্যান্ডেলিং (ব্যাকএন্ডভেদে 'product' বা 'productId' থাকতে পারে)
    const p = item.product || item.productId || item;

    // ১. ইমেজ এক্সট্রাকশন (অ্যারে/অবজেক্ট/স্ট্রিং যাই হোক)
    let finalImage = '/placeholder.png';
    const rawImages = p.images || item.images || [];
    if (Array.isArray(rawImages) && rawImages.length > 0) {
      finalImage = typeof rawImages[0] === 'object' ? rawImages[0].url : rawImages[0];
    } else if (p.image || item.image) {
      finalImage = p.image || item.image;
    }

    // ২. প্রাইস হ্যান্ডেলিং (ডিসকাউন্ট বা রেগুলার প্রাইস চেক)
    const getPrice = (obj) =>
      typeof obj === 'object' ? obj?.discounted || obj?.regular || 0 : obj || 0;
    const finalPrice = getPrice(item.price) || getPrice(p.price) || 0;

    // ৩. আইডি হ্যান্ডেলিং (নিশ্চিত করা যে এটি স্ট্রিং হিসেবে থাকে)
    const rawId = p._id || item.productId || item._id;
    const finalId = typeof rawId === 'object' ? rawId._id : rawId;

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
    const response = await API.get(`/cart?sessionId=${sessionId}`);
    const items = response.data.cart?.items || response.data.items || [];
    return mapCartItems(items);
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
      const items = response.data.cart?.items || response.data.items || [];
      return mapCartItems(items);
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
      const items = response.data.cart?.items || response.data.items || [];
      return mapCartItems(items);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

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
    // এই ফাংশনটি ProductCard এর বিল্ড এরর সমাধান করবে
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

// সবগুলো এক্সপোর্ট নিশ্চিত করা হয়েছে
export const { addToCartLocal, updateQuantityLocal, removeFromCartLocal, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
