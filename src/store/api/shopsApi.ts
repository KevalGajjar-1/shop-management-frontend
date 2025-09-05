import { CreateShopRequest, Shop, ShopsQueryParams, ShopsResponse, UpdateShopRequest } from '../../interfaces';
import { baseApi } from './baseApi';

export const shopsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShops: builder.query<ShopsResponse, ShopsQueryParams>({
      query: ({ search = '', page = 1, limit = 10 }) => ({
        url: '/shops',
        params: { search, page, limit },
      }),
      // ✅ Better cache management
      keepUnusedDataFor: 300, // Keep cache for 5 minutes
      serializeQueryArgs: ({ queryArgs }) => {
        // ✅ Cache based on search term, ignore page for infinite scroll
        return `shops-${queryArgs.search}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        return {
          ...newItems,
          data: [ ...(currentCache?.data || []), ...(newItems.data || []) ],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.search !== previousArg?.search;
      },
      providesTags: [ 'Shop' ],
    }),

    getShopsWithProducts: builder.query<{ success: boolean; data: Shop[] }, void>({
      query: () => '/shops/with-products',
      providesTags: [ 'ShopsWithProducts' ],
    }),

    getShop: builder.query<{ success: boolean; data: Shop }, string>({
      query: (id) => `/shops/${id}`,
      providesTags: (_result, _error, id) => [ { type: 'Shop', id } ],
    }),

    createShop: builder.mutation<{ success: boolean; data: Shop }, CreateShopRequest>({
      query: (shopData) => ({
        url: '/shops',
        method: 'POST',
        body: shopData,
      }),
      invalidatesTags: [ 'Shop', 'ShopsWithProducts' ],
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
      invalidatesTags: [ 'Shop', 'ShopsWithProducts', 'Product' ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetShopsQuery,
  useGetShopsWithProductsQuery,
  useGetShopQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
} = shopsApi;