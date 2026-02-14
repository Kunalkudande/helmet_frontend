'use client';

import { useEffect, useState } from 'react';
import {
  Eye, Users, Activity, Globe, Monitor, Smartphone, Tablet,
  TrendingUp, Clock, ArrowUpRight, BarChart3, Chrome, Layout,
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';

interface VisitorStats {
  overview: {
    totalPageViews: number;
    uniqueVisitors: number;
    uniqueSessions: number;
    avgPagesPerSession: number;
  };
  today: {
    pageViews: number;
    uniqueVisitors: number;
  };
  topPages: { page: string; views: number }[];
  devices: { device: string; count: number }[];
  browsers: { browser: string; count: number }[];
  recentVisitors: any[];
  dailyVisits: { date: string; pageViews: number; uniqueVisitors: number; sessions: number }[];
  period: string;
}

const deviceIcons: Record<string, any> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const pageLabels: Record<string, string> = {
  '/': 'Home',
  '/products': 'All Products',
  '/categories': 'Categories',
  '/cart': 'Cart',
  '/checkout': 'Checkout',
  '/login': 'Login',
  '/register': 'Register',
  '/about': 'About',
  '/contact': 'Contact',
  '/blog': 'Blog',
};

function getPageLabel(page: string): string {
  if (pageLabels[page]) return pageLabels[page];
  if (page.startsWith('/products/')) return `Product: ${page.split('/').pop()}`;
  if (page.startsWith('/account')) return `Account${page.replace('/account', '')}`;
  return page;
}

export default function AdminVisitors() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/visitors?days=${days}`)
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-2xl p-6 h-32 animate-pulse border border-white/10" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/[0.03] rounded-2xl p-6 h-64 animate-pulse border border-white/10" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-brand-400">Failed to load visitor data.</p>
      </div>
    );
  }

  const overviewCards = [
    { label: 'Page Views', value: stats.overview.totalPageViews, icon: Eye, gradient: 'from-blue-500 to-indigo-600', todayValue: stats.today.pageViews },
    { label: 'Unique Visitors', value: stats.overview.uniqueVisitors, icon: Users, gradient: 'from-emerald-500 to-teal-600', todayValue: stats.today.uniqueVisitors },
    { label: 'Sessions', value: stats.overview.uniqueSessions, icon: Activity, gradient: 'from-violet-500 to-purple-600', todayValue: null },
    { label: 'Avg Pages/Session', value: stats.overview.avgPagesPerSession, icon: TrendingUp, gradient: 'from-orange-500 to-red-500', todayValue: null },
  ];

  // Chart: compute the max for scaling bars
  const maxDaily = Math.max(...(stats.dailyVisits?.map((d) => d.pageViews) || [1]), 1);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Visitor Analytics</h1>
          <p className="text-brand-500 mt-1">Track who&apos;s visiting your store</p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 14, 30, 60].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                days === d
                  ? 'bg-accent-500 text-white'
                  : 'bg-white/5 text-brand-400 hover:bg-white/10 hover:text-white border border-white/10'
              )}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {overviewCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="relative bg-white/[0.03] rounded-2xl p-5 border border-white/10 overflow-hidden group hover:border-white/20 transition-all"
          >
            <div className={cn('absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br', stat.gradient)} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className={cn('p-2 rounded-xl bg-gradient-to-br', stat.gradient)}>
                  <stat.icon size={18} className="text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value.toLocaleString()}</p>
              <p className="text-xs text-brand-500 mt-1">{stat.label}</p>
              {stat.todayValue !== null && (
                <p className="text-xs text-accent-400 mt-1 flex items-center gap-1">
                  <ArrowUpRight size={12} />
                  {stat.todayValue} today
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visits Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-accent-500" />
            <h2 className="font-semibold text-white">Daily Visitors</h2>
          </div>
          <div className="flex items-end gap-[3px] h-40">
            {stats.dailyVisits?.map((day, i) => (
              <div
                key={i}
                className="flex-1 group relative"
              >
                <div
                  className="w-full bg-accent-500/70 rounded-t-sm hover:bg-accent-400 transition-colors cursor-pointer"
                  style={{ height: `${(day.pageViews / maxDaily) * 100}%`, minHeight: '2px' }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-brand-900 border border-white/10 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
                    <p className="font-medium text-white">{new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-brand-400">{day.pageViews} views · {day.uniqueVisitors} visitors</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {stats.dailyVisits?.length > 0 && (
            <div className="flex justify-between mt-2 text-[10px] text-brand-600">
              <span>{new Date(stats.dailyVisits[0]?.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              <span>{new Date(stats.dailyVisits[stats.dailyVisits.length - 1]?.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
            </div>
          )}
        </motion.div>

        {/* Top Pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.03] rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-5">
            <Layout size={18} className="text-accent-500" />
            <h2 className="font-semibold text-white">Top Pages</h2>
          </div>
          <div className="space-y-3">
            {stats.topPages.map((p, i) => {
              const maxViews = stats.topPages[0]?.views || 1;
              return (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-brand-300 truncate max-w-[200px]" title={p.page}>
                      {getPageLabel(p.page)}
                    </span>
                    <span className="text-xs font-medium text-white">{p.views}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-500/60 rounded-full transition-all"
                      style={{ width: `${(p.views / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/[0.03] rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-5">
            <Monitor size={18} className="text-accent-500" />
            <h2 className="font-semibold text-white">Devices</h2>
          </div>
          <div className="space-y-4">
            {stats.devices.map((d, i) => {
              const total = stats.devices.reduce((s, v) => s + v.count, 0) || 1;
              const pct = Math.round((d.count / total) * 100);
              const Icon = deviceIcons[d.device] || Globe;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-brand-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white capitalize">{d.device}</span>
                      <span className="text-xs text-brand-400">{pct}% · {d.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-500/60 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Browser Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/[0.03] rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-5">
            <Chrome size={18} className="text-accent-500" />
            <h2 className="font-semibold text-white">Browsers</h2>
          </div>
          <div className="space-y-4">
            {stats.browsers.map((b, i) => {
              const total = stats.browsers.reduce((s, v) => s + v.count, 0) || 1;
              const pct = Math.round((b.count / total) * 100);
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Globe size={18} className="text-brand-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{b.browser}</span>
                      <span className="text-xs text-brand-400">{pct}% · {b.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500/60 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Visitors Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-accent-500" />
            <h2 className="font-semibold text-white">Recent Visitors</h2>
            <span className="text-xs text-brand-500 ml-2">Last 50 sessions</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-6 py-3 text-xs font-medium text-brand-400 uppercase tracking-wider">IP</th>
                <th className="px-6 py-3 text-xs font-medium text-brand-400 uppercase tracking-wider">Page</th>
                <th className="px-6 py-3 text-xs font-medium text-brand-400 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-xs font-medium text-brand-400 uppercase tracking-wider">Browser</th>
                <th className="px-6 py-3 text-xs font-medium text-brand-400 uppercase tracking-wider">OS</th>
                <th className="px-6 py-3 text-xs font-medium text-brand-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentVisitors.map((v: any, i: number) => {
                const DeviceIcon = deviceIcons[v.device] || Globe;
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-brand-300">{v.ip === '::1' || v.ip === '127.0.0.1' ? 'localhost' : v.ip}</td>
                    <td className="px-6 py-3 text-white max-w-[200px] truncate" title={v.page}>{getPageLabel(v.page)}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5 text-brand-400 capitalize">
                        <DeviceIcon size={14} />
                        {v.device}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-brand-400">{v.browser}</td>
                    <td className="px-6 py-3 text-brand-400">{v.os}</td>
                    <td className="px-6 py-3 text-brand-500 text-xs">
                      {new Date(v.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                );
              })}
              {stats.recentVisitors.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-brand-500">No visitors yet. Data will appear as people visit your store.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
