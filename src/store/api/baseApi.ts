import { createApi } from '@reduxjs/toolkit/query/react';
import customBaseQuery from './customBaseQuery';
import { logout } from '../slices/authSlice';

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await customBaseQuery(args, api, extraOptions);
  
  // Handle 401 errors (token expired)
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: 'shopManagementApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Shop', 'Product', 'ShopsWithProducts'],
  endpoints: () => ({}),
});
