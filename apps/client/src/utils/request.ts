/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { API_HOST } from '../config';
import { clearStore, useAuthStore } from '../store';

class ApiError extends Error {
  constructor(public message: string, public code: number) {
    super(message);
  }
}

const request = axios.create({
  baseURL: API_HOST,
});

request.interceptors.request.use(rConfig => {
  return {
    ...rConfig,
    headers: {
      ...rConfig.headers,
      Authorization: `Bearer ${useAuthStore.getState().token}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
  };
});

request.interceptors.response.use(
  e => e.data,
  err => {
    if ((err.response.data.statusCode || err.response.status) === 401) {
      clearStore();
    }

    throw new ApiError(
      Array.isArray(err.response?.data?.message)
        ? err.response?.data?.message[0]
        : err.response?.data?.message || err.response?.statusText || '出错了！',
      err.response?.data?.statusCode || err.response?.status || 500,
    );
  },
);

export default {
  get: <T = any, P = any>(url: string, params?: P): Promise<T> => {
    return request<T, P>({ method: 'GET', url, params }) as any;
  },
  post: <T = any, P = any>(url: string, data?: P): Promise<T> => {
    return request<T, P>({ method: 'POST', url, data }) as any;
  },
  put: <T = any, P = any>(url: string, data?: P): Promise<T> => {
    return request<T, P>({ method: 'PUT', url, data }) as any;
  },
  del: <T = any, P = any>(url: string, params?: P): Promise<T> => {
    return request<T, P>({ method: 'DELETE', url, params }) as any;
  },
};
