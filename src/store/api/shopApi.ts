import { baseApi } from './baseApi';
import { ApiResponse, Shop, ShopFormData } from '../../types';

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<ApiResponse<Shop[]>, Record<string, any> | void>({
      query: (params = {}) => ({
        url: '/shops',
        params,
      }),
      providesTags: ['Shop'],
    }),
    getShopsWithProducts: builder.query<ApiResponse<Shop[]>, void>({
      query: () => '/shops/with-products',
      providesTags: ['Shop', 'Product'],
    }),
    getShopById: builder.query<ApiResponse<Shop>, string>({
      query: (id) => `/shops/${id}`,
      providesTags: (result, error, id) => [{ type: 'Shop', id }],
    }),
    createShop: builder.mutation<ApiResponse<Shop>, ShopFormData>({
      query: (shopData) => ({
        url: '/shops',
        method: 'POST',
        body: shopData,
      }),
      invalidatesTags: ['Shop'],
    }),
    updateShop: builder.mutation<ApiResponse<Shop>, { id: string } & Partial<ShopFormData>>({
      query: ({ id, ...shopData }) => ({
        url: `/shops/${id}`,
        method: 'PUT',
        body: shopData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Shop', id }, 'Shop'],
    }),
    deleteShop: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/shops/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Shop'],
    }),
  }),
});

export const {
  useGetShopsQuery,
  useGetShopsWithProductsQuery,
  useGetShopByIdQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
} = shopApi;
