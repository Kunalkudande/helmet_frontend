'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Heart, MapPin, User, Package, ChevronRight, LogOut,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useWishlist } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { formatPrice, formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/ui/Loader';
import { useAuthStore } from '@/store/authStore';

const menuItems = [
  { label: 'My Orders', href: '/account/orders', icon: Package, desc: 'View and track your orders' },
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart, desc: 'Your saved items' },
  { label: 'Profile', href: '/account/profile', icon: User, desc: 'Manage your profile & addresses' },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { data: ordersData } = useOrders({ page: 1, limit: 3 });
  const { wishlist: wishlistData } = useWishlist();
  const { totalItems: cartItems } = useCart();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) return <PageLoader />;

  const recentOrders = ordersData?.orders || [];
  const wishlistCount = wishlistData?.length || 0;
  const orderCount = ordersData?.pagination?.total || 0;

  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="bg-white/[0.03] rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent-500/10 flex items-center justify-center text-accent-400 text-2xl font-bold">
              {user.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h1 className="text-xl font-display text-white">
                Hi, {user.fullName}
              </h1>
              <p className="text-sm text-brand-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Orders', value: orderCount, icon: Package, color: 'bg-blue-500/10 text-blue-400' },
            { label: 'Wishlist', value: wishlistCount, icon: Heart, color: 'bg-red-500/10 text-red-400' },
            { label: 'Cart Items', value: cartItems, icon: ShoppingBag, color: 'bg-orange-500/10 text-orange-400' },
            { label: 'Addresses', value: user.addresses?.length || 0, icon: MapPin, color: 'bg-green-500/10 text-green-400' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] rounded-xl p-4 border border-white/10"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-brand-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-accent-500/30 transition group"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-500/10 text-accent-500 flex items-center justify-center group-hover:bg-accent-500/20 transition">
                  <item.icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="text-xs text-brand-500">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-brand-600 group-hover:text-accent-500 transition" />
              </Link>
            ))}
            <button
              onClick={async () => { await logout(); router.push('/'); }}
              className="flex items-center gap-4 w-full bg-white/[0.03] rounded-xl p-4 border border-white/10 hover:border-red-500/30 transition group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                <LogOut size={18} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-400">Logout</p>
                <p className="text-xs text-brand-500">Sign out of your account</p>
              </div>
            </button>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white">Recent Orders</h2>
                <Link href="/account/orders" className="text-sm text-accent-400 hover:underline">View All</Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package size={40} className="mx-auto text-brand-600 mb-3" />
                  <p className="text-brand-500">No orders yet</p>
                  <Link href="/products" className="text-accent-400 text-sm hover:underline">Start Shopping →</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order: any) => (
                    <Link
                      key={order.id}
                      href={`/account/orders/${order.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg border border-white/5 hover:border-accent-500/20 hover:bg-accent-500/5 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">#{order.orderNumber}</p>
                        <p className="text-xs text-brand-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">{formatPrice(order.total)}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-400">{order.orderStatus || order.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
