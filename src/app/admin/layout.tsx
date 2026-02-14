'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
// Using native img for logo to avoid Next.js caching issues
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, X, ChevronRight, Bell, Search, Home, Eye,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { IMAGES, SITE_NAME } from '@/lib/constants';

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Visitors', href: '/admin/visitors', icon: Eye },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // Use store directly instead of useAuth() hook to avoid extra /auth/me call
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Only check auth once on mount if not already loaded
  useEffect(() => {
    if (isLoading) checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !user || user.role !== 'ADMIN') return null;

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(0,0%,5%)]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-72 h-screen flex-shrink-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white transform transition-transform duration-300 ease-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-3">
              <img src={IMAGES.logoDark} alt={SITE_NAME} width={44} height={44} className="w-11 h-11 rounded-md object-contain" />
              <div>
                <h1 className="font-bold text-lg tracking-tight">{SITE_NAME}</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Panel</p>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <p className="px-3 mb-3 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Main Menu</p>
            {adminNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    active 
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-white shadow-sm border border-orange-500/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    active 
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40" 
                      : "bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white"
                  )}>
                    <item.icon size={16} />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight size={14} className="text-orange-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Back to Store */}
          <div className="px-4 py-4 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition"
            >
              <div className="p-2 rounded-lg bg-slate-800">
                <Home size={16} />
              </div>
              <span>Back to Store</span>
            </Link>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10 bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-orange-500/30">
                {user.fullName?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.fullName}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={async () => { await logout(); router.push('/'); }}
              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex-shrink-0 bg-[hsl(0,0%,7%)]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg transition"
              >
                <Menu size={22} className="text-brand-400" />
              </button>
              <div className="hidden sm:block">
                <nav className="flex items-center gap-1 text-sm text-brand-500">
                  <Link href="/admin" className="hover:text-white">Admin</Link>
                  <ChevronRight size={14} />
                  <span className="text-white font-medium capitalize">
                    {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()}
                  </span>
                </nav>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 hover:bg-white/10 rounded-xl transition relative">
                <Bell size={20} className="text-brand-500" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.fullName?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[hsl(0,0%,7%)] border-t border-white/5 z-30 safe-area-pb">
        <div className="flex justify-around py-2">
          {adminNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition",
                  active ? "text-orange-500" : "text-brand-500"
                )}
              >
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className={cn("text-[10px] font-medium", active && "font-semibold")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
