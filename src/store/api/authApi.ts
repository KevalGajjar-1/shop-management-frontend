import { baseApi } from './baseApi';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
  overrideExisting: false,
});

// Export auth hooks
export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi;
