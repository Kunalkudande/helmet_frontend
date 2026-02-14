'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product, ProductFilters, ProductsResponse } from '@/types';

// Fetch products with filters
export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    staleTime: 2 * 60 * 1000, // 2 minutes — avoid refetching on every mount
    queryFn: async () => {
      const params = new URLSearchParams();

      // Map frontend sort values to backend sortBy/sortOrder params
      const sortMapping: Record<string, { sortBy: string; sortOrder: string }> = {
        newest: { sortBy: 'createdAt', sortOrder: 'desc' },
        price_asc: { sortBy: 'price', sortOrder: 'asc' },
        price_desc: { sortBy: 'price', sortOrder: 'desc' },
        rating: { sortBy: 'rating', sortOrder: 'desc' },
        popular: { sortBy: 'totalReviews', sortOrder: 'desc' },
        name_asc: { sortBy: 'name', sortOrder: 'asc' },
        name_desc: { sortBy: 'name', sortOrder: 'desc' },
      };

      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === null) return;
        if (key === 'sort') {
          const mapped = sortMapping[value as string] || sortMapping.newest;
          params.append('sortBy', mapped.sortBy);
          params.append('sortOrder', mapped.sortOrder);
        } else if (key === 'featured') {
          // Backend doesn't have a featured filter — skip
        } else {
          params.append(key, String(value));
        }
      });

      const response = await api.get(`/products?${params.toString()}`);
      const raw = response.data.data;

      // Map backend response shape to frontend expected shape
      return {
        products: raw.items || [],
        pagination: {
          page: raw.page,
          limit: raw.limit,
          total: raw.total,
          totalPages: raw.totalPages,
          hasMore: raw.hasNext,
        },
      } as ProductsResponse;
    },
  });
}

// Fetch single product by slug
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    staleTime: 3 * 60 * 1000, // 3 minutes
    queryFn: async () => {
      const response = await api.get(`/products/${slug}`);
      const data = response.data.data;
      // Backend returns product directly or {product: {...}}
      return (data.product || data) as Product;
    },
    enabled: !!slug,
  });
}

// Fetch featured products
export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    staleTime: 5 * 60 * 1000, // 5 minutes — featured products rarely change
    queryFn: async () => {
      const response = await api.get('/products/featured');
      const data = response.data.data;
      // Backend returns array directly or {products: [...]}
      return (Array.isArray(data) ? data : data.products || []) as Product[];
    },
  });
}

// Fetch related products
export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: ['products', 'related', slug],
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      const response = await api.get(`/products/${slug}/related`);
      const data = response.data.data;
      return (Array.isArray(data) ? data : data.products || []) as Product[];
    },
    enabled: !!slug,
  });
}

// Fetch brands
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await api.get('/products/brands');
      const data = response.data.data;
      return (Array.isArray(data) ? data : data.brands || []) as string[];
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Category counts
export function useCategoryCounts() {
  return useQuery({
    queryKey: ['products', 'category-counts'],
    staleTime: 10 * 60 * 1000, // 10 minutes
    queryFn: async () => {
      const response = await api.get('/products/category-counts');
      return response.data.data as Record<string, number>;
    },
  });
}

// Search autocomplete
export function useSearchAutocomplete(query: string) {
  return useQuery({
    queryKey: ['search', 'autocomplete', query],
    queryFn: async () => {
      const response = await api.get(`/products/search/autocomplete?q=${encodeURIComponent(query)}`);
      const data = response.data.data;
      return (Array.isArray(data) ? data : data.suggestions || []) as { name: string; slug: string }[];
    },
    enabled: query.length >= 2,
    staleTime: 60 * 1000, // 1 minute
  });
}

// Wishlist hooks
export function useWishlist() {
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ['wishlist'],
    staleTime: 2 * 60 * 1000, // 2 minutes
    queryFn: async () => {
      const response = await api.get('/users/wishlist');
      const data = response.data.data;
      return (Array.isArray(data) ? data : data.wishlist || []) as any[];
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.post(`/users/wishlist/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete(`/users/wishlist/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  return {
    wishlist: wishlistQuery.data || [],
    isLoading: wishlistQuery.isLoading,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isInWishlist: (productId: string) =>
      wishlistQuery.data?.some((p) => p.productId === productId || p.product?.id === productId) || false,
  };
}
