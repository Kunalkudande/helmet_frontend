'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Calendar, Percent, DollarSign, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number | null;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

const initialForm = {
  code: '',
  description: '',
  discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
  discountValue: '',
  minPurchase: '',
  maxDiscount: '',
  usageLimit: '',
  validFrom: '',
  validUntil: '',
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(initialForm);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/admin/coupons');
      setCoupons(res.data.data || []);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.description || !form.discountValue || !form.minPurchase || !form.usageLimit || !form.validFrom || !form.validUntil) {
      toast.error('Please fill all required fields');
      return;
    }
    setCreating(true);
    try {
      await api.post('/admin/coupons', {
        code: form.code.toUpperCase(),
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minPurchase: Number(form.minPurchase),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: Number(form.usageLimit),
        validFrom: form.validFrom,
        validUntil: form.validUntil,
      });
      toast.success('Coupon created!');
      setForm(initialForm);
      setShowForm(false);
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create coupon');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await api.put(`/admin/coupons/${id}/toggle`);
      toast.success(res.data.message);
      fetchCoupons();
    } catch {
      toast.error('Failed to toggle coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const inputClass = 'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder:text-brand-500 hover:border-white/20';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-white">Coupons</h1>
          <p className="text-sm text-brand-500 mt-1">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} leftIcon={showForm ? undefined : <Plus size={16} />}>
          {showForm ? 'Cancel' : 'New Coupon'}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Tag size={18} className="text-accent-500" />
            Create Coupon
          </h2>
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Code *</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. SUMMER20"
                  className={inputClass}
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Description *</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Summer sale 20% off"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Discount Type *</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as 'PERCENTAGE' | 'FIXED' })}
                  className={cn(inputClass, 'bg-white/5')}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">
                  Discount Value * {form.discountType === 'PERCENTAGE' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === 'PERCENTAGE' ? 'e.g. 20' : 'e.g. 500'}
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Min Purchase (₹) *</label>
                <input
                  type="number"
                  value={form.minPurchase}
                  onChange={(e) => setForm({ ...form, minPurchase: e.target.value })}
                  placeholder="e.g. 1000"
                  className={inputClass}
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Max Discount (₹)</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  placeholder="Optional cap"
                  className={inputClass}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Usage Limit *</label>
                <input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  placeholder="e.g. 100"
                  className={inputClass}
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Valid From *</label>
                <input
                  type="datetime-local"
                  value={form.validFrom}
                  onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Valid Until *</label>
                <input
                  type="datetime-local"
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={creating}>
                <Plus size={16} className="mr-1" /> Create Coupon
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        {coupons.length === 0 ? (
          <div className="text-center py-16">
            <Tag size={48} className="mx-auto text-brand-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No coupons yet</h3>
            <p className="text-sm text-brand-500 mb-6">Create your first coupon to offer discounts</p>
            <Button onClick={() => setShowForm(true)} leftIcon={<Plus size={16} />}>
              Create Coupon
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-6 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider">Discount</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider hidden md:table-cell">Min Purchase</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider hidden lg:table-cell">Usage</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider hidden lg:table-cell">Valid Period</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map((coupon) => {
                  const isExpired = new Date(coupon.validUntil) < new Date();
                  const isUsedUp = coupon.usedCount >= coupon.usageLimit;

                  return (
                    <tr key={coupon.id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <div>
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-accent-500/10 text-accent-400 font-mono font-bold text-sm">
                            {coupon.code}
                          </span>
                          <p className="text-xs text-brand-500 mt-1">{coupon.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-white font-semibold">
                          {coupon.discountType === 'PERCENTAGE' ? (
                            <>
                              <Percent size={14} className="text-green-400" />
                              <span>{Number(coupon.discountValue)}%</span>
                            </>
                          ) : (
                            <>
                              <span>₹{Number(coupon.discountValue).toLocaleString('en-IN')}</span>
                            </>
                          )}
                        </div>
                        {coupon.maxDiscount && (
                          <p className="text-xs text-brand-500 mt-0.5">Max: ₹{Number(coupon.maxDiscount).toLocaleString('en-IN')}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm text-brand-300">₹{Number(coupon.minPurchase).toLocaleString('en-IN')}</span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-sm text-brand-300">
                          {coupon.usedCount} / {coupon.usageLimit}
                        </span>
                        <div className="w-16 h-1.5 bg-white/5 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-accent-500 rounded-full"
                            style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="text-xs text-brand-400 space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{new Date(coupon.validFrom).toLocaleDateString('en-IN')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>to</span>
                            <span>{new Date(coupon.validUntil).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {isExpired ? (
                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold">Expired</span>
                        ) : isUsedUp ? (
                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-semibold">Used Up</span>
                        ) : coupon.isActive ? (
                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold">Active</span>
                        ) : (
                          <span className="inline-flex px-2.5 py-1 rounded-lg bg-white/5 text-brand-400 text-xs font-semibold">Inactive</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggle(coupon.id)}
                            className="p-2 rounded-lg hover:bg-white/5 text-brand-400 hover:text-white transition"
                            title={coupon.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {coupon.isActive ? <ToggleRight size={18} className="text-green-400" /> : <ToggleLeft size={18} />}
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-brand-400 hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
