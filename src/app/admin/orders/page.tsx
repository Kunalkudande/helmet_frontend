'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Eye, Search, Filter, Package, Clock, MapPin, RefreshCw, X, Mail, Phone,
} from 'lucide-react';
import api from '@/lib/api';
import { formatPrice, formatDate, getOrderStatusColor, cn } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  'PENDING': { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-500' },
  'CONFIRMED': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-500' },
  'PROCESSING': { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-500' },
  'SHIPPED': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', dot: 'bg-indigo-500' },
  'DELIVERED': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  'CANCELLED': { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-500' },
};

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admin/orders', { params });
      const raw = res.data.data;
      setOrders(raw.items || raw.orders || []);
      setPagination({
        total: raw.total,
        pages: raw.totalPages,
        page: raw.page,
        hasNext: raw.hasNext,
        hasPrev: raw.hasPrev,
      });
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [page, statusFilter]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const getStatusStyle = (status: string) => statusStyles[status] || { bg: 'bg-white/5', text: 'text-brand-300', dot: 'bg-brand-500' };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Orders</h1>
          <p className="text-brand-500 mt-1">Manage and track customer orders</p>
        </div>
        <button
          onClick={() => fetchOrders()}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm font-medium text-brand-400 hover:bg-white/5 transition"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-brand-500" />
          <span className="text-sm font-medium text-brand-400">Status:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setStatusFilter(''); setPage(1); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition",
              !statusFilter 
                ? "bg-orange-500 text-white" 
                : "bg-white/[0.03] border border-white/10 text-brand-400 hover:bg-white/5"
            )}
          >
            All Orders
          </button>
          {ORDER_STATUSES.map((s) => {
            const style = getStatusStyle(s.value);
            return (
              <button
                key={s.value}
                onClick={() => { setStatusFilter(s.value); setPage(1); }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2",
                  statusFilter === s.value 
                    ? cn(style.bg, style.text, "ring-2 ring-offset-1", style.text.replace('text-', 'ring-')) 
                    : "bg-white/[0.03] border border-white/10 text-brand-400 hover:bg-white/5"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full", style.dot)} />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-brand-500">
            <RefreshCw size={32} className="animate-spin mb-3" />
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Package size={40} className="text-brand-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No orders found</h3>
            <p className="text-brand-500 text-sm">Orders will appear here once customers start placing them</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Items</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Payment</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order, idx) => {
                  const status = order.orderStatus || order.status;
                  const style = getStatusStyle(status);
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-white/5 transition group"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white group-hover:text-orange-500 transition">#{order.orderNumber}</p>
                          <p className="text-xs text-brand-500 mt-0.5 flex items-center gap-1">
                            <Clock size={10} />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(order.user?.fullName || order.user?.firstName || '?').charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">{order.user?.fullName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim()}</p>
                            <p className="text-xs text-brand-500 truncate">{order.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/5 text-xs font-semibold text-brand-300">
                          {order.items?.length || 0} items
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{formatPrice(order.total)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-lg font-semibold border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 appearance-none pr-8",
                            style.bg, style.text
                          )}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 8px center',
                            backgroundSize: '12px',
                          }}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-xs font-medium text-brand-300">{order.paymentMethod}</p>
                          <p className={cn(
                            "text-xs mt-0.5",
                            order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                          )}>
                            {order.paymentStatus}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg text-brand-500 hover:text-orange-500 hover:bg-orange-500/10 transition"
                        >
                          <Eye size={18} />
                        </button>
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
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-brand-500">
            Showing <span className="font-semibold text-white">{orders.length}</span> of <span className="font-semibold text-white">{pagination.total}</span> orders
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
              <span className="text-brand-500">{pagination.pages}</span>
            </div>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-sm font-medium text-brand-400 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} title="" size="lg">
        {selectedOrder && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-semibold text-white">Order #{selectedOrder.orderNumber}</h2>
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-semibold",
                    getStatusStyle(selectedOrder.orderStatus || selectedOrder.status).bg,
                    getStatusStyle(selectedOrder.orderStatus || selectedOrder.status).text
                  )}>
                    {(selectedOrder.orderStatus || selectedOrder.status)?.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-brand-500 flex items-center gap-1">
                  <Clock size={12} />
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <p className="text-2xl font-semibold text-white">{formatPrice(selectedOrder.total)}</p>
            </div>

            {/* Customer & Payment */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Customer</h3>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">
                    {(selectedOrder.user?.fullName || selectedOrder.user?.firstName || '?').charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{selectedOrder.user?.fullName || `${selectedOrder.user?.firstName || ''} ${selectedOrder.user?.lastName || ''}`.trim()}</p>
                    <div className="flex items-center gap-3 text-xs text-brand-500 mt-0.5">
                      <span className="flex items-center gap-1"><Mail size={10} />{selectedOrder.user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Payment</h3>
                <div className="space-y-1">
                  <p className="font-semibold text-white">{selectedOrder.paymentMethod}</p>
                  <p className={cn(
                    "text-sm",
                    selectedOrder.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'
                  )}>
                    {selectedOrder.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-brand-500 uppercase tracking-wider">Order Items</h3>
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between bg-white/[0.03] rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-brand-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.productName || item.product?.name || 'Product'}</p>
                        <p className="text-xs text-brand-500">Size: {item.size} • Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-white">{formatPrice(item.subtotal || item.total)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {(selectedOrder.address || selectedOrder.shippingAddress) && (() => {
              const addr = selectedOrder.address || selectedOrder.shippingAddress;
              return (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-brand-500 uppercase tracking-wider flex items-center gap-1"><MapPin size={12} />Shipping Address</h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="font-semibold text-white">{addr.fullName}</p>
                    <p className="text-sm text-brand-400 mt-1">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-sm text-brand-400">{addr.addressLine2}</p>}
                    <p className="text-sm text-brand-400">{addr.city}, {addr.state} - {addr.pinCode}</p>
                    <p className="text-sm text-brand-500 mt-2 flex items-center gap-1"><Phone size={12} />{addr.phone}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
    </div>
  );
}
