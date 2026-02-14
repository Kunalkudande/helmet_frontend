'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, logout, checkAuth, updateUser } = useAuthStore();
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only call checkAuth once per hook lifecycle, not on every render
    if (!hasChecked.current) {
      hasChecked.current = true;
      checkAuth();
    }
  }, [checkAuth]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      setUser(data.data.user, data.data.accessToken);
      const displayName = data.data.user.fullName || data.data.user.firstName || 'there';
      toast.success(`Welcome back, ${displayName}!`);
      router.push('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      toast.error(message);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      // Backend expects fullName, not firstName/lastName
      const { firstName, lastName, ...rest } = credentials;
      const payload = {
        ...rest,
        fullName: `${firstName} ${lastName}`.trim(),
      };
      const response = await api.post('/auth/register', payload);
      return response.data;
    },
    onSuccess: (data: AuthResponse) => {
      setUser(data.data.user, data.data.accessToken);
      toast.success('Account created successfully! Please verify your email.');
      router.push('/');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(message);
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset link sent to your email.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to send reset link.';
      toast.error(message);
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const response = await api.post('/auth/reset-password', { token, password });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password reset successfully! Please log in.');
      router.push('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to reset password.';
      toast.error(message);
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    updateUser,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
  };
}

// Hook for protected routes
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return { isAuthenticated, isLoading };
}

// Hook for admin routes
export function useRequireAdmin() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'ADMIN') {
        router.push('/');
        toast.error('Access denied. Admin only.');
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  return { user, isAuthenticated, isLoading, isAdmin: user?.role === 'ADMIN' };
}
