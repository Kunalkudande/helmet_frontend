import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For refresh token cookies
});

// Request interceptor - attach access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors & refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: string; message?: string; success?: boolean }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear stale tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Only redirect to login for protected routes, not public ones
        if (typeof window !== 'undefined') {
          const publicPaths = ['/products', '/categories', '/', '/about', '/contact', '/blog'];
          const currentPath = window.location.pathname;
          const isPublicPage = publicPaths.some(p => currentPath === p || currentPath.startsWith(p + '/') || currentPath.startsWith('/products'));
          if (!isPublicPage) {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors - use 'error' field from backend
    const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again.';

    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 404) {
      // Don't show toast for 404s by default
    } else if (error.response?.status === 429) {
      toast.error('Too many requests. Please wait and try again.');
    } else if (error.response?.status && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;

// Helper functions for common API calls
export const apiGet = async <T>(url: string, params?: Record<string, any>): Promise<T> => {
  const response = await api.get(url, { params });
  return response.data;
};

export const apiPost = async <T>(url: string, data?: any): Promise<T> => {
  const response = await api.post(url, data);
  return response.data;
};

export const apiPut = async <T>(url: string, data?: any): Promise<T> => {
  const response = await api.put(url, data);
  return response.data;
};

export const apiPatch = async <T>(url: string, data?: any): Promise<T> => {
  const response = await api.patch(url, data);
  return response.data;
};

export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await api.delete(url);
  return response.data;
};

// Multipart form data helper
export const apiPostFormData = async <T>(url: string, formData: FormData): Promise<T> => {
  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const apiPutFormData = async <T>(url: string, formData: FormData): Promise<T> => {
  const response = await api.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
