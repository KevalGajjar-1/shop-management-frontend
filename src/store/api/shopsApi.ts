import { baseApi } from './baseApi';
import type { Shop, CreateShopRequest, UpdateShopRequest } from './types';

export const shopsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<{ success: boolean; data: Shop[] }, { search?: string }>({
      query: ({ search }) => ({ url: '/shops', params: { search } }),
      providesTags: ['Shop'],
    }),

    getShopsWithProducts: builder.query<{ success: boolean; data: Shop[] }, void>({
      query: () => '/shops/with-products',
      providesTags: ['ShopsWithProducts'],
    }),

    getShop: builder.query<{ success: boolean; data: Shop }, string>({
      query: (id) => `/shops/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Shop', id }],
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
      invalidatesTags: (_result, _error, { id }) => [
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
    
  }),
  overrideExisting: false,
});

// Export shop hooks
export const {
  useGetShopsQuery,
  useGetShopsWithProductsQuery,
  useGetShopQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
} = shopsApi;
