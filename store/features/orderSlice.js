import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '@/api/axios';

const initialState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
  success: false,
  orderId: null,
};

// ১️⃣ Create Order
export const createOrder = createAsyncThunk('order/create', async (orderData, thunkAPI) => {
  try {
    const response = await API.post('/orders/create', orderData);
    // ব্যাকএন্ড থেকে { success: true, orderId: "..." } আসবে
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Order placement failed');
  }
});

// ২️⃣ Get My Orders
export const getMyOrders = createAsyncThunk('order/myOrders', async (_, thunkAPI) => {
  try {
    const response = await API.get('/orders/my-orders');
    return response.data; // আশা করা হচ্ছে { success: true, orders: [] }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

// ৩️⃣ Get Order Details
export const getOrderDetails = createAsyncThunk('order/details', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Error fetching order details'
    );
  }
});

// ৪️⃣ Cancel Order (User)
export const cancelOrder = createAsyncThunk('order/cancel', async (id, thunkAPI) => {
  try {
    const response = await API.patch(`/orders/cancel/${id}`);
    return { id, message: response.data.message };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Cancellation failed');
  }
});

// ৫️⃣ Admin: Get All Orders
export const getAllOrdersAdmin = createAsyncThunk('order/adminAll', async (_, thunkAPI) => {
  try {
    const response = await API.get('/orders/admin/all');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Failed to fetch admin orders'
    );
  }
});

// ৬️⃣ Admin: Update Order Status
export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await API.patch(`/orders/admin/status/${id}`, { status });
      return { id, status, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update status');
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
      // --- Create Order ---
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderId = action.payload.orderId;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // --- Get My Orders ---
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Get Order Details ---
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload.order || null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Cancel Order ---
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        // স্টেট আপডেট: orders লিস্ট থেকে ওই অর্ডারকে CANCELLED করে দেওয়া
        state.orders = state.orders.map((order) =>
          order._id === action.payload.id ? { ...order, orderStatus: 'CANCELLED' } : order
        );
        // যদি ওই মুহূর্তেই ইউজার ডিটেইলস পেজে থাকে
        if (state.orderDetails && state.orderDetails._id === action.payload.id) {
          state.orderDetails.orderStatus = 'CANCELLED';
        }
      })

      // --- Admin: Update Status ---
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order._id === action.payload.id ? { ...order, orderStatus: action.payload.status } : order
        );
        if (state.orderDetails && state.orderDetails._id === action.payload.id) {
          state.orderDetails.orderStatus = action.payload.status;
        }
      })

      // --- Admin: Get All Orders ---
      .addCase(getAllOrdersAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllOrdersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(getAllOrdersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState, clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
