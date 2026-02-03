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

// --- ১. Create Order (Regular/Cart Checkout) ---
export const createOrder = createAsyncThunk('order/create', async (orderData, thunkAPI) => {
  try {
    const response = await API.post('/orders/create', orderData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Order placement failed');
  }
});

// --- ১.১ Create Single Order (Buy Now) ---
// এটি নতুন এন্ডপয়েন্ট /orders/create-single কল করবে
export const createSingleOrder = createAsyncThunk(
  'order/createSingle',
  async (orderData, thunkAPI) => {
    try {
      const response = await API.post('/orders/create-single', orderData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Buy Now order failed');
    }
  }
);

// --- ২. Get My Orders ---
export const getMyOrders = createAsyncThunk('order/myOrders', async (_, thunkAPI) => {
  try {
    const response = await API.get('/orders/my-orders');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

// --- ৩. Get Order Details ---
export const getOrderDetails = createAsyncThunk('order/details', async (id, thunkAPI) => {
  try {
    const response = await API.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error fetching details');
  }
});

// --- ৪. Cancel Order (User) ---
export const cancelOrder = createAsyncThunk('order/cancel', async (id, thunkAPI) => {
  try {
    const response = await API.patch(`/orders/cancel/${id}`);
    return { id, status: 'CANCELLED' };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Cancellation failed');
  }
});

// --- ৫. Admin: Get All Orders ---
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

// --- ৬. Admin: Update Order Status ---
export const updateOrderStatusAdmin = createAsyncThunk(
  'order/updateStatusAdmin',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await API.patch(`/orders/admin/status/${id}`, { status });
      return { id, status };
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
      // ১. Create Order & Create Single Order Fulfilled
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderId = action.payload.orderId;
      })
      .addCase(createSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderId = action.payload.orderId;
      })
      // ২. Get Orders
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      .addCase(getAllOrdersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || [];
      })
      // ৩. Order Details
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload.order || null;
      })
      // ৪. Status Updates (Admin & User)
      .addCase(updateOrderStatusAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        const index = state.orders.findIndex((o) => o._id === id);
        if (index !== -1) state.orders[index].orderStatus = status;
        if (state.orderDetails && state.orderDetails._id === id) {
          state.orderDetails.orderStatus = status;
        }
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        const { id, status } = action.payload;
        const index = state.orders.findIndex((o) => o._id === id);
        if (index !== -1) state.orders[index].orderStatus = status;
        if (state.orderDetails && state.orderDetails._id === id) {
          state.orderDetails.orderStatus = status;
        }
      })

      // ৫. Global Matchers (Pending, Fulfilled, Rejected handle kore)
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetOrderState, clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;
