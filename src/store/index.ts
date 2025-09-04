import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import authReducer from './slices/authSlice';
import shopReducer from './slices/shopSlice';
import productReducer from './slices/productSlice';
import { baseApi } from './api/baseApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    shop: shopReducer,
    product: productReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production'
});

setupListeners(store.dispatch);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
