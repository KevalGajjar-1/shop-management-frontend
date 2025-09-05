import { createApi } from '@reduxjs/toolkit/query/react';
import customBaseQuery from './customBaseQuery';
import { logout } from '../slices/authSlice';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Shop {
  _id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
  totalValue?: number;
  products?: Product[];
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  shop: {
    _id: string;
    name: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface CreateShopRequest {
  name: string;
  description?: string;
  address: string;
  phone: string;
}

export interface UpdateShopRequest {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  shop: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}

// Enhanced baseQuery with error handling
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await customBaseQuery(args, api, extraOptions);
  
  // Handle 401 errors (token expired)
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  
  return result;
};

export const shopManagementApi = createApi({
  reducerPath: 'shopManagementApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Shop', 'Product', 'ShopsWithProducts'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Shop endpoints
    getShops: builder.query<{ success: boolean; data: Shop[] }, void>({
      query: () => '/shops',
      providesTags: ['Shop'],
    }),

    getShopsWithProducts: builder.query<{ success: boolean; data: Shop[] }, void>({
      query: () => '/shops/with-products',
      providesTags: ['ShopsWithProducts'],
    }),

    getShop: builder.query<{ success: boolean; data: Shop }, string>({
      query: (id) => `/shops/${id}`,
      providesTags: (result, error, id) => [{ type: 'Shop', id }],
    }),

    createShop: builder.mutation<{ success: boolean; data: Shop }, CreateShopRequest>({
      query: (shopData) => ({
        url: '/shops',
        method: 'POST',
        body: shopData,
      }),
      invalidatesTags: ['Shop', 'ShopsWithProducts'],
    }),

    updateShop: builder.mutation<
      { success: boolean; data: Shop },
      { id: string; data: UpdateShopRequest }
    >({
      query: ({ id, data }) => ({
        url: `/shops/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Shop', id },
        'Shop',
        'ShopsWithProducts',
      ],
    }),

    deleteShop: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/shops/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Shop', 'ShopsWithProducts'],
    }),

    // Product endpoints
    getProducts: builder.query<
      { success: boolean; data: Product[]; pagination: any },
      {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
      } | void
    >({
      query: (params = {}) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),

    getProductsByShop: builder.query<
      { success: boolean; data: Product[]; pagination: any },
      {
        shopId: string;
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
      }
    >({
      query: ({ shopId, ...params }) => ({
        url: `/products/shop/${shopId}`,
        params,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'Product', id: `shop-${shopId}` },
      ],
    }),

    getProduct: builder.query<{ success: boolean; data: Product }, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation<{ success: boolean; data: Product }, CreateProductRequest>({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product', 'ShopsWithProducts'],
    }),

    updateProduct: builder.mutation<
      { success: boolean; data: Product },
      { id: string; data: UpdateProductRequest }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product',
        'ShopsWithProducts',
      ],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product', 'ShopsWithProducts'],
    }),
  }),
});

// Export hooks
export const {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,

  // Shop hooks
  useGetShopsQuery,
  useGetShopsWithProductsQuery,
  useGetShopQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,

  // Product hooks
  useGetProductsQuery,
  useGetProductsByShopQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = shopManagementApi;
