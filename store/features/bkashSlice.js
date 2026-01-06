import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '@/api/axios';

// ১. বিকাশ পেমেন্ট ইউআরএল জেনারেট করার থাঙ্ক
export const createBkashPayment = createAsyncThunk(
  'bkash/createPayment',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/bkash/create/${orderId}`);
      if (data.url) {
        return data.url; // শুধুমাত্র ইউআরএল রিটার্ন করবে
      } else {
        return rejectWithValue(data.statusMessage || 'Failed to get payment URL');
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'bKash Gateway Error');
    }
  }
);

const bkashSlice = createSlice({
  name: 'bkash',
  initialState: {
    paymentUrl: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetBkashState: (state) => {
      state.paymentUrl = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBkashPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBkashPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload;
      })
      .addCase(createBkashPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBkashState } = bkashSlice.actions;
export default bkashSlice.reducer;
