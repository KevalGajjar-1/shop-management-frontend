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
