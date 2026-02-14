'use client';

import { useEffect, useState } from 'react';
import {
  Users, Search, ChevronLeft, ChevronRight, Mail, Phone, ShoppingBag, Eye, MapPin, Calendar, CheckCircle2, XCircle, RefreshCw,
} from 'lucide-react';
import api from '@/lib/api';
import { formatDate, formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { motion } from 'framer-motion';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (search) params.search = search;
      const res = await api.get('/admin/customers', { params });
      const data = res.data.data;
      setCustomers(data.items || []);
      setPagination({ total: data.total, totalPages: data.totalPages, hasNext: data.hasNext, hasPrev: data.hasPrev });
    } catch (error) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchCustomers(); }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Customers</h1>
          <p className="text-brand-500 mt-1">Manage your customer base</p>
        </div>
        <button
          onClick={() => fetchCustomers()}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm font-medium text-brand-400 hover:bg-white/5 transition"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-brand-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-brand-500">
            <RefreshCw size={32} className="animate-spin mb-3" />
            <p>Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Users size={40} className="text-brand-500" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">No customers found</h3>
            <p className="text-brand-500 text-sm">Customers will appear here once they register</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Orders</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-brand-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((customer, idx) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-white/5 transition group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/30 flex-shrink-0">
                          {customer.fullName?.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-white group-hover:text-orange-500 transition">{customer.fullName}</p>
                          <p className="text-xs text-brand-500 truncate">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-brand-400 flex items-center gap-1.5">
                          <Mail size={12} className="text-brand-500" />
                          <span className="truncate max-w-[180px]">{customer.email}</span>
                        </p>
                        <p className="text-sm text-brand-500 flex items-center gap-1.5">
                          <Phone size={12} className="text-brand-500" />
                          {customer.phone || 'Not provided'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-brand-300 text-xs font-semibold">
                        <ShoppingBag size={12} />
                        {customer._count?.orders || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
                        customer.isVerified 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-amber-500/10 text-amber-400"
                      )}>
                        {customer.isVerified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {customer.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-brand-400 flex items-center gap-1.5">
                        <Calendar size={12} className="text-brand-500" />
                        {formatDate(customer.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 rounded-lg text-brand-500 hover:text-orange-500 hover:bg-orange-500/10 transition"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-brand-500">
            Showing <span className="font-semibold text-white">{customers.length}</span> of <span className="font-semibold text-white">{pagination.total}</span> customers
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

      {/* Customer Detail Modal */}
      <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title="" size="md">
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-violet-500/30">
                {selectedCustomer.fullName?.charAt(0) || '?'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedCustomer.fullName}</h2>
                <p className="text-sm text-brand-500 flex items-center gap-1 mt-0.5">
                  <Calendar size={12} />
                  Customer since {formatDate(selectedCustomer.createdAt)}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2">Email</p>
                <p className="text-sm text-white flex items-center gap-2">
                  <Mail size={14} className="text-brand-500" />
                  {selectedCustomer.email}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2">Phone</p>
                <p className="text-sm text-white flex items-center gap-2">
                  <Phone size={14} className="text-brand-500" />
                  {selectedCustomer.phone || 'Not provided'}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2">Orders</p>
                <p className="text-sm text-white flex items-center gap-2">
                  <ShoppingBag size={14} className="text-brand-500" />
                  {selectedCustomer._count?.orders || 0} total orders
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2">Status</p>
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold",
                  selectedCustomer.isVerified 
                    ? "bg-emerald-500/10 text-emerald-400" 
                    : "bg-amber-500/10 text-amber-400"
                )}>
                  {selectedCustomer.isVerified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {selectedCustomer.isVerified ? 'Verified Account' : 'Unverified'}
                </span>
              </div>
            </div>

            {/* Addresses */}
            {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-brand-500 uppercase tracking-wider flex items-center gap-1">
                  <MapPin size={12} />
                  Saved Addresses
                </h3>
                <div className="space-y-3">
                  {selectedCustomer.addresses.map((addr: any) => (
                    <div key={addr.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-white">{addr.fullName}</p>
                        <span className="text-xs px-2 py-1 rounded-lg bg-white/10 text-brand-400 font-medium">
                          {addr.addressType}
                        </span>
                      </div>
                      <p className="text-sm text-brand-400">{addr.addressLine1}</p>
                      {addr.addressLine2 && <p className="text-sm text-brand-400">{addr.addressLine2}</p>}
                      <p className="text-sm text-brand-400">{addr.city}, {addr.state} - {addr.pinCode}</p>
                      <p className="text-sm text-brand-500 mt-2 flex items-center gap-1">
                        <Phone size={12} />
                        {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
