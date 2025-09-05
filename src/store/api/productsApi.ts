import { baseApi } from './baseApi';
import type { Product, CreateProductRequest, UpdateProductRequest } from './types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      providesTags: (result) => [
        'Product',
        ...(result?.data || []).map(({ _id }) => ({ type: 'Product' as const, id: _id }))
      ],
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
      providesTags: (result, _error, { shopId }) => [
        'Product',
        { type: 'Product', id: `shop-${shopId}` },
        { type: 'Shop', id: shopId },
        ...(result?.data || []).map(({ _id }) => ({ type: 'Product' as const, id: _id }))
      ],
    }),

    getProduct: builder.query<{ success: boolean; data: Product }, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [ { type: 'Product', id } ],
    }),

    createProduct: builder.mutation<{ success: boolean; data: Product }, CreateProductRequest>({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      // ✅ FIXED: Correct TypeScript return type
      invalidatesTags: (result, error, arg) => {
        if (error) return [];

        return [
          'Product' as const,
          'Shop' as const,
          'ShopsWithProducts' as const,
          { type: 'Shop' as const, id: arg.shop },
          { type: 'Product' as const, id: `shop-${arg.shop}` },
          ...(result?.data?._id ? [ { type: 'Product' as const, id: result.data._id } ] : [])
        ];
      },
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
      // ✅ FIXED: Correct TypeScript return type with explicit typing
      invalidatesTags: (_result, error, { id, data }) => {
        console.log(data);
        // Return empty array on error
        if (error) return [];

        // Base tags to always invalidate
        const baseTags = [
          'Product' as const,
          'Shop' as const,
          'ShopsWithProducts' as const,
          { type: 'Product' as const, id }
        ];
        return [ ...baseTags ];
      },
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      // ✅ Simple array - no function needed for static invalidation
      invalidatesTags: [ 'Product', 'Shop', 'ShopsWithProducts' ],
    }),
  }),
  overrideExisting: false,
});

// Export product hooks
export const {
  useGetProductsQuery,
  useGetProductsByShopQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
