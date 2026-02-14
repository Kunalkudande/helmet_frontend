'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice, formatDate, getOrderStatusColor } from '@/lib/utils';
import { ORDER_STATUSES } from '@/lib/constants';
import { PageLoader, OrderSkeleton } from '@/components/ui/Loader';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const page = Number(searchParams.get('page') || '1');
  const status = searchParams.get('status') || '';

  const { data, isLoading } = useOrders({ page, limit: 10, status: status || undefined });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/account/orders');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) return <PageLoader />;

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/account" className="text-brand-500 hover:text-accent-400">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-display text-white">My Orders</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href="/account/orders"
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition',
              !status ? 'bg-accent-500 text-white' : 'bg-white/5 text-brand-400 hover:bg-white/10'
            )}
          >
            All
          </Link>
          {ORDER_STATUSES.map((s) => (
            <Link
              key={s.value}
              href={`/account/orders?status=${s.value}`}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition',
                status === s.value ? 'bg-accent-500 text-white' : 'bg-white/5 text-brand-400 hover:bg-white/10'
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <OrderSkeleton key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.03] rounded-2xl border border-white/10">
            <Package size={48} className="mx-auto text-brand-600 mb-4" />
            <h2 className="text-lg font-semibold text-white">No orders found</h2>
            <p className="text-brand-500 mt-1">
              {status ? 'No orders with this status' : "You haven't placed any orders yet"}
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 text-accent-400 font-medium hover:underline"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const status = order.orderStatus || order.status;
              const statusColor = getOrderStatusColor(status);
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block bg-white/[0.03] rounded-xl border border-white/10 hover:border-accent-500/20 transition overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div>
                        <span className="text-sm font-semibold text-white">#{order.orderNumber}</span>
                        <span className="text-xs text-brand-500 ml-2">{formatDate(order.createdAt)}</span>
                      </div>
                      <span className={cn('text-xs px-3 py-1 rounded-full font-medium', statusColor)}>
                        {status?.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {order.items?.slice(0, 3).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <div className="w-10 h-10 bg-white/5 rounded flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-brand-300">{item.productName || item.product?.name || 'Product'}</p>
                            <p className="text-xs text-brand-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium text-white">{formatPrice(item.subtotal || item.total)}</span>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <p className="text-xs text-brand-500">+{order.items.length - 3} more items</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <div>
                        <span className="text-xs text-brand-500">Payment: </span>
                        <span className="text-xs font-medium text-brand-300">{order.paymentMethod}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-brand-500">Total: </span>
                        <span className="font-bold text-white">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
              <Link
                href={`/account/orders?page=${page - 1}${status ? `&status=${status}` : ''}`}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent-500/30 transition"
              >
                <ChevronLeft size={18} />
              </Link>
            )}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/account/orders?page=${p}${status ? `&status=${status}` : ''}`}
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition',
                  page === p ? 'bg-accent-500 text-white' : 'bg-white/5 border border-white/10 text-brand-400 hover:border-accent-500/30'
                )}
              >
                {p}
              </Link>
            ))}
            {page < pagination.totalPages && (
              <Link
                href={`/account/orders?page=${page + 1}${status ? `&status=${status}` : ''}`}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-accent-500/30 transition"
              >
                <ChevronRight size={18} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OrdersContent />
    </Suspense>
  );
}
