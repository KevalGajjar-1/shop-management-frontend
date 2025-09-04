import { baseApi } from './baseApi';
import { ApiResponse, Product, ProductFormData } from '../../types';

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponse<Product[]>, Record<string, any> | void>({
      query: (params = {}) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProductsByShop: builder.query<ApiResponse<Product[]>, { shopId: string } & Record<string, any>>({
      query: ({ shopId, ...params }) => ({
        url: `/products/shop/${shopId}`,
        params,
      }),
      providesTags: (result, error, { shopId }) => [
        { type: 'Product', id: `shop-${shopId}` }
      ],
    }),
    getProductById: builder.query<ApiResponse<Product>, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<ApiResponse<Product>, ProductFormData>({
      query: (productData) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<ApiResponse<Product>, { id: string } & Partial<ProductFormData>>({
      query: ({ id, ...productData }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),
    deleteProduct: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByShopQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
