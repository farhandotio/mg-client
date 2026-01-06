import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
  success: false,
  orderId: null,
};

// ১. চেকআউট শেষ করে অর্ডার তৈরি করা
export const createOrder = createAsyncThunk('order/create', async (orderData, thunkAPI) => {
  try {
    console.log('📡 API Call: POST /orders/create with data:', orderData);
    const response = await API.post('/orders/create', orderData);

    // ব্যাকএন্ড যদি { success: true, order: { _id: '...' } } পাঠায়
    // তবে নিশ্চিত করুন আপনি সরাসরি সেই অবজেক্টটি রিটার্ন করছেন
    console.log('✅ API Response Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API Error:', error.response?.data);
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Order placement failed');
  }
});

// ২. ইউজারের নিজের সব অর্ডার লিস্ট দেখা
export const getMyOrders = createAsyncThunk('order/myOrders', async (_, thunkAPI) => {
  try {
    const response = await API.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

// ৩. একটি নির্দিষ্ট অর্ডারের বিস্তারিত দেখা
export const getOrderDetails = createAsyncThunk('order/details', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching details');
  }
});

// ৪. ইউজার অর্ডার ক্যানসেল করা
export const cancelOrder = createAsyncThunk('order/cancel', async (id, thunkAPI) => {
  try {
    const response = await API.patch(`/orders/cancel/${id}`);
    return { id, data: response.data };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Cancellation failed');
  }
});

// ৫. অ্যাডমিন সব অর্ডার দেখবে
export const getAllOrdersAdmin = createAsyncThunk('order/adminAll', async (_, thunkAPI) => {
  try {
    const response = await API.get('/orders/admin/all');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

// ৬. অর্ডারের স্ট্যাটাস আপডেট করা (Admin)
export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await API.patch(`/orders/admin/status/${id}`, { status });
      return { id, status, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.success = false;
      state.error = null;
      state.orderId = null;
      state.loading = false;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        // ব্যাকএন্ডের ভিন্ন ভিন্ন রেসপন্স ফরম্যাট হ্যান্ডেল করা:
        // ১. সরাসরি আইডি থাকলে: action.payload._id
        // ২. আপনার বর্তমান কোড অনুযায়ী: action.payload.orderId
        // ৩. যদি অবজেক্টের ভেতর থাকে: action.payload.order?._id
        state.orderId = action.payload._id || action.payload.orderId || action.payload.order?._id;

        console.log('💾 Redux Store Updated with Order ID:', state.orderId);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Get My Orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || action.payload;
      })

      // Get Order Details
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.orderDetails = action.payload.order || action.payload;
      })

      // Cancel Order (User)
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload.id);
        if (index !== -1) {
          state.orders[index].orderStatus = 'Cancelled';
        }
        if (state.orderDetails?._id === action.payload.id) {
          state.orderDetails.orderStatus = 'Cancelled';
        }
      })

      // Admin: Update Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload.id);
        if (index !== -1) {
          state.orders[index].orderStatus = action.payload.status;
        }
      });
  },
});

export const { resetOrderState, clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
