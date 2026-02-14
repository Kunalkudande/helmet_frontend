'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Package, RefreshCw, ImageIcon, Layers,
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (search) params.search = search;
      const res = await api.get('/products', { params });
      const data = res.data.data;
      setProducts(data.items || []);
      setPagination({ total: data.total, totalPages: data.totalPages, hasNext: data.hasNext, hasPrev: data.hasPrev });
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  // Debounced search — only triggers when search actually changes (not on mount)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => { setPage(1); fetchProducts(); }, 400);
    return () => clearTimeout(timer);
  }, [search]);



  // Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteId}`);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  // Toggle active status
  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/products/${id}`, { isActive: !isActive });
      toast.success(isActive ? 'Product deactivated' : 'Product activated');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const getImageUrl = (product: any): string | null => {
    if (!product.images || product.images.length === 0) return null;
    const img = product.images[0];
    return typeof img === 'string' ? img : img.imageUrl || null;
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Products</h1>
          <p className="text-brand-500 mt-1">Manage your product catalog</p>
        </div>
        <Button
          onClick={() => router.push('/admin/products/new')}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/30"
        >
          <Plus size={18} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-brand-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>
        <button
          onClick={() => fetchProducts()}
          className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm font-medium text-brand-400 hover:bg-white/5 transition"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-brand-500">
            <RefreshCw size={32} className="animate-spin mb-3" />
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Package size={40} className="text-brand-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No products found</h3>
            <p className="text-brand-500 text-sm mb-4">Try adjusting your search or add new products</p>
            <Button onClick={() => router.push('/admin/products/new')} className="bg-orange-500 hover:bg-orange-600">
              <Plus size={16} className="mr-2" /> Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product, idx) => {
                  const imageUrl = getImageUrl(product);
                  return (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-white/5 transition group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 relative">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-500">
                                <Package size={24} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate max-w-[200px] group-hover:text-orange-500 transition">{product.name}</p>
                            <p className="text-xs text-brand-500 mt-0.5">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/5 text-xs font-medium text-brand-400">
                            {product.category?.replace(/_/g, ' ')}
                          </span>
                          {product.images?.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-brand-500" title={`${product.images.length} images`}>
                              <ImageIcon size={12} /> {product.images.length}
                            </span>
                          )}
                          {product.variants?.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-brand-500" title={`${product.variants.length} variants`}>
                              <Layers size={12} /> {product.variants.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-bold text-white">{formatPrice(product.discountPrice || product.price)}</p>
                          {product.discountPrice && (
                            <p className="text-xs text-brand-500 line-through">{formatPrice(product.price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold',
                          product.stock > 10
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : product.stock > 0
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-red-500/10 text-red-400'
                        )}>
                          {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Low (${product.stock})` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleActive(product.id, product.isActive)}
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition',
                            product.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-white/5 text-brand-500 hover:bg-white/10'
                          )}
                        >
                          <span className={cn(
                            'w-2 h-2 rounded-full',
                            product.isActive ? 'bg-emerald-500' : 'bg-brand-500'
                          )} />
                          {product.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                            className="p-2 rounded-lg text-brand-500 hover:text-orange-500 hover:bg-orange-500/10 transition"
                            title="Edit product"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="p-2 rounded-lg text-brand-500 hover:text-red-600 hover:bg-red-500/10 transition"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-brand-500">
            Showing <span className="font-semibold text-white">{products.length}</span> of <span className="font-semibold text-white">{pagination.total}</span> products
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm font-medium text-brand-400 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <div className="flex items-center gap-1 px-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm">
              <span className="font-semibold text-white">{page}</span>
              <span className="text-brand-500">/</span>
              <span className="text-brand-500">{pagination.totalPages}</span>
            </div>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm font-medium text-brand-400 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product">
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <Trash2 size={28} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Delete this product?</h3>
          <p className="text-brand-500 text-sm mb-6">This action cannot be undone. The product will be permanently removed from your catalog.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteId(null)} className="px-6 py-2.5 bg-white/5 text-brand-300 rounded-xl font-medium hover:bg-white/10 transition">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition shadow-lg shadow-red-500/30 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </Modal>


    </div>
  );
}
