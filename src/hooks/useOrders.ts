'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { Order, CreateOrderData, VerifyPaymentData } from '@/types';

// Fetch user orders
export function useOrders(options: { page?: number; limit?: number; status?: string } = {}) {
  const { page = 1, limit = 10, status } = options;
  return useQuery({
    queryKey: ['orders', page, limit, status],
    staleTime: 60 * 1000, // 1 minute
    queryFn: async () => {
      let url = `/orders?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      const response = await api.get(url);
      const raw = response.data.data;
      // Map backend shape to frontend expected shape
      return {
        orders: raw.items || raw.orders || [],
        pagination: {
          page: raw.page,
          limit: raw.limit,
          total: raw.total,
          totalPages: raw.totalPages,
          hasNext: raw.hasNext,
          hasPrev: raw.hasPrev,
        },
      };
    },
  });
}

// Fetch single order
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    staleTime: 60 * 1000, // 1 minute
    queryFn: async () => {
      const response = await api.get(`/orders/${orderId}`);
      const data = response.data.data;
      return (data.order || data) as Order;
    },
    enabled: !!orderId,
  });
}

// Create order
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderData) => {
      const response = await api.post('/orders', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create order';
      toast.error(message);
    },
  });
}

// Verify payment
export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VerifyPaymentData) => {
      const response = await api.post('/orders/verify-payment', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Payment verified successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Payment verification failed';
      toast.error(message);
    },
  });
}

// Cancel order
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to cancel order';
      toast.error(message);
    },
  });
}
