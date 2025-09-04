import { baseApi } from './baseApi';
import { loginStart, loginSuccess, loginFailure } from '../slices/authSlice';
import { ApiResponse, LoginFormData, RegisterFormData, User } from '../../types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      ApiResponse<{ user: User; token: string }>, 
      Omit<RegisterFormData, 'confirmPassword'>
    >({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    login: builder.mutation<ApiResponse<{ user: User; token: string }>, LoginFormData>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(loginStart());
        try {
          const { data } = await queryFulfilled;
          dispatch(loginSuccess({
            user: data.data.user,
            token: data.data.token
          }));
        } catch (error: any) {
          const errorMessage = error?.error?.data?.message || 
                              error?.error?.message || 
                              'Login failed';
          dispatch(loginFailure(errorMessage));
        }
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
