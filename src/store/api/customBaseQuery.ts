import { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { RootState } from '../index';

interface CustomError {
  status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR';
  data?: any;
  message?: string;
}

interface CustomArgs {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const DEFAULT_TIMEOUT = 60000; // 10 seconds

const customBaseQuery: BaseQueryFn<
  string | CustomArgs,
  unknown,
  CustomError
> = async (args, api) => {
  try {
    // Parse arguments
    let url: string;
    let method: string = 'GET';
    let body: any = undefined;
    let params: Record<string, any> = {};
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (typeof args === 'string') {
      url = args;
    } else {
      url = args.url;
      method = args.method || 'GET';
      body = args.body;
      params = args.params || {};
      headers = { ...headers, ...args.headers };
    }

    // Get auth token from Redux state
    const state = api.getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Build URL with params
    const urlWithParams = new URL(url.startsWith('/') ? url.slice(1) : url, API_BASE_URL);
    Object.keys(params).forEach(key => 
      urlWithParams.searchParams.append(key, params[key])
    );

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    // Combine signals (timeout + RTK Query's abort signal)
    const combinedSignal = api.signal;
    if (combinedSignal.aborted) {
      controller.abort();
    }

    try {
      const response = await fetch(urlWithParams.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        return {
          error: {
            status: response.status,
            data: responseData,
            message: responseData?.message || `HTTP ${response.status}: ${response.statusText}`,
          },
        };
      }

      return { data: responseData };

    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return {
          error: {
            status: 'TIMEOUT_ERROR',
            message: 'Request timeout',
          },
        };
      }

      throw fetchError;
    }

  } catch (error: any) {
    // Handle network errors, parsing errors, etc.
    return {
      error: {
        status: 'FETCH_ERROR',
        message: error.message || 'Network error occurred',
        data: error,
      },
    };
  }
};

export default customBaseQuery;
