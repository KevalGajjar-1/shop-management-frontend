import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Shop, ShopState } from '../../types';

const initialState: ShopState = {
  shops: [],
  currentShop: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    page: 1,
    limit: 10
  }
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShops: (state, action: PayloadAction<Shop[]>) => {
      state.shops = action.payload;
    },
    setCurrentShop: (state, action: PayloadAction<Shop | null>) => {
      state.currentShop = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ShopState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setShops, 
  setCurrentShop, 
  setLoading, 
  setError, 
  setFilters, 
  clearError 
} = shopSlice.actions;
export default shopSlice.reducer;
