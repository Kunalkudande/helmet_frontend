'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, ShoppingBag, Users, Package, IndianRupee, ArrowUpRight, ArrowDownRight,
  Calendar, Clock, ExternalLink, MoreHorizontal,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { formatPrice, formatDate, getOrderStatusColor, cn } from '@/lib/utils';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  ordersByStatus: Record<string, number>;
  monthlyRevenue: number;
}

const statusColors: Record<string, string> = {
  'PENDING': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'CONFIRMED': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'PROCESSING': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'SHIPPED': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'DELIVERED': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'CANCELLED': 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (error) {
        setStats({
          totalOrders: 0, totalRevenue: 0, totalCustomers: 0, totalProducts: 0,
          recentOrders: [], ordersByStatus: {}, monthlyRevenue: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-2xl p-6 h-36 animate-pulse border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: IndianRupee, gradient: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-500/10', change: '+12.5%', up: true },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, gradient: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-500/10', change: '+8.2%', up: true },
    { label: 'Customers', value: stats?.totalCustomers || 0, icon: Users, gradient: 'from-violet-500 to-purple-600', bgLight: 'bg-violet-500/10', change: '+15%', up: true },
    { label: 'Products', value: stats?.totalProducts || 0, icon: Package, gradient: 'from-orange-500 to-red-500', bgLight: 'bg-orange-500/10', change: '', up: true },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-brand-500 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-brand-500 bg-white/[0.03] px-4 py-2 rounded-xl border border-white/10">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative bg-white/[0.03] rounded-2xl p-6 border border-white/10 overflow-hidden group hover:border-white/20 transition-all"
          >
            {/* Background decoration */}
            <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br", stat.gradient)} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg", stat.gradient)}>
                  <stat.icon size={22} className="text-white" />
                </div>
                {stat.change && (
                  <span className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
                    stat.up ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                  )}>
                    {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-brand-500 mt-1">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div>
              <h2 className="font-semibold text-white">Recent Orders</h2>
              <p className="text-xs text-brand-500 mt-0.5">Latest customer orders</p>
            </div>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-400 transition">
              View All
              <ExternalLink size={14} />
            </Link>
          </div>
          {(stats?.recentOrders || []).length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag size={40} className="mx-auto text-brand-600 mb-3" />
              <p className="text-brand-500">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {stats?.recentOrders.slice(0, 5).map((order: any, idx: number) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={`/admin/orders?id=${order.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {(order.user?.fullName || order.user?.firstName || '?').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">#{order.orderNumber}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium border",
                          statusColors[order.orderStatus || order.status] || 'bg-white/5 text-brand-400 border-white/10'
                        )}>
                          {(order.orderStatus || order.status)?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-brand-500 truncate">
                        {order.user?.fullName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatPrice(order.total)}</p>
                      <p className="text-xs text-brand-500 flex items-center justify-end gap-1">
                        <Clock size={10} />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="font-semibold text-white">Order Status</h2>
            <p className="text-xs text-brand-500 mt-0.5">Distribution by status</p>
          </div>
          {stats?.ordersByStatus && Object.keys(stats.ordersByStatus).length > 0 ? (
            <div className="p-6 space-y-4">
              {Object.entries(stats.ordersByStatus).map(([status, count]) => {
                const total = Object.values(stats.ordersByStatus).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                const colors: Record<string, string> = {
                  'PENDING': 'bg-amber-500',
                  'CONFIRMED': 'bg-blue-500',
                  'PROCESSING': 'bg-purple-500',
                  'SHIPPED': 'bg-indigo-500',
                  'DELIVERED': 'bg-emerald-500',
                  'CANCELLED': 'bg-red-500',
                };
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2.5 h-2.5 rounded-full", colors[status] || 'bg-slate-400')} />
                        <span className="text-brand-300 font-medium">{status.replace(/_/g, ' ')}</span>
                      </div>
                      <span className="font-semibold text-white">{count} <span className="text-brand-500 font-normal">({percentage}%)</span></span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn("h-full rounded-full", colors[status] || 'bg-slate-400')}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <TrendingUp size={40} className="mx-auto text-brand-600 mb-3" />
              <p className="text-brand-500">No data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="text-white">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
              <p className="text-brand-400 text-sm mt-1">Manage your store efficiently</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl text-sm font-semibold hover:bg-white/20 transition border border-white/10"
            >
              <Package size={16} />
              Manage Products
            </Link>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30"
            >
              <ShoppingBag size={16} />
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
