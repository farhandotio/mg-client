import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

const initialState = {
  loading: false,
  error: null,
  gatewayUrl: null,
  success: false,
};

// ১️⃣ Init Payment → ব্যাকএন্ডের /api/payment/ssl/init রুটে হিট করবে
export const initSSLPayment = createAsyncThunk('payment/init', async ({ orderId }, thunkAPI) => {
  try {
    const response = await API.post('/payment/ssl/init', { orderId });
    // ব্যাকএন্ড রেসপন্স: { success: true, gatewayUrl: "..." }
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'পেমেন্ট গেটওয়ে লোড করতে সমস্যা হচ্ছে'
    );
  }
});

/**
 * নোট: sslPaymentSuccess, sslPaymentFail এবং sslPaymentCancel থাঙ্কগুলো রিমুভ করা হয়েছে।
 * কারণ: আপনার ব্যাকএন্ড সরাসরি 'res.redirect' করে ফ্রন্টএন্ডের URL-এ পাঠিয়ে দিচ্ছে।
 * ফ্রন্টএন্ডের কাজ শুধু গেটওয়ে ইউআরএল-এ ইউজারকে পাঠিয়ে দেওয়া।
 */

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.gatewayUrl = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Init Payment
      .addCase(initSSLPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.gatewayUrl = null;
      })
      .addCase(initSSLPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.gatewayUrl = action.payload.gatewayUrl; // SSLCommerz গেটওয়ে লিংক
      })
      .addCase(initSSLPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
