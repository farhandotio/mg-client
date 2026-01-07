import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import productReducer from './features/productSlice';
import cartReducer from './features/cartSlice';
import categoryReducer from './features/categorySlice';
import brandReducer from './features/brandSlice';
import orderReducer from './features/orderSlice';
import paymentReducer from './features/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    categories: categoryReducer,
    brands: brandReducer,
    order: orderReducer,
    payment: paymentReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
