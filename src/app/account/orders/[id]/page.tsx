'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Package, MapPin, CreditCard, Truck, CheckCircle, XCircle, Clock,
  Download, Phone, Mail, RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOrder, useCancelOrder, useVerifyPayment } from '@/hooks/useOrders';
import { formatPrice, formatDate, formatDateTime, getOrderStatusColor, getPaymentStatusColor, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import { openRazorpayCheckout } from '@/lib/razorpay';
import toast from 'react-hot-toast';

const statusSteps = [
  { key: 'PENDING', label: 'Order Placed', icon: Clock },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
  { key: 'PROCESSING', label: 'Processing', icon: Package },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: order, isLoading, refetch } = useOrder(params.id as string);
  const cancelOrder = useCancelOrder();
  const verifyPayment = useVerifyPayment();
  const [isRetrying, setIsRetrying] = useState(false);

  const isSuccess = searchParams.get('success') === 'true';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) return <PageLoader />;
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto text-brand-600 mb-3" />
          <p className="text-brand-500">Order not found</p>
          <Link href="/account/orders" className="text-accent-400 text-sm hover:underline mt-2 inline-block">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const orderStatus = (order as any).orderStatus || (order as any).status || order.orderStatus;
  const currentStepIndex = statusSteps.findIndex((s) => s.key === orderStatus);
  const isCancelled = orderStatus === 'CANCELLED';
  const canCancel = ['PENDING', 'CONFIRMED'].includes(orderStatus);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder.mutateAsync(order.id);
      toast.success('Order cancelled successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel order');
    }
  };

  // Retry payment for RAZORPAY orders with pending payment
  const canRetryPayment =
    order.paymentMethod === 'RAZORPAY' &&
    order.paymentStatus === 'PENDING' &&
    ['PENDING'].includes(orderStatus) &&
    (order as any).razorpayOrderId;

  const handleRetryPayment = async () => {
    if (isRetrying) return;
    setIsRetrying(true);

    try {
      // Use the existing razorpay order
      await openRazorpayCheckout({
        orderId: (order as any).razorpayOrderId,
        amount: Math.round(Number(order.total) * 100), // convert to paise
        prefill: {
          name: user?.fullName || '',
          email: user?.email,
          contact: user?.phone,
        },
        onSuccess: async (paymentResponse) => {
          try {
            await verifyPayment.mutateAsync({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              orderId: order.id,
            });
            refetch();
            toast.success('Payment successful!');
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
          }
          setIsRetrying(false);
        },
        onFailure: (error) => {
          const reason = error?.description || error?.reason || error?.message || 'Payment failed';
          // payment retry error handled by toast
          toast.error(`Payment failed: ${reason}`);
          setIsRetrying(false);
        },
      });
    } catch (err) {
      toast.error('Failed to open payment gateway');
      setIsRetrying(false);
    }
  };

  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        {/* Success banner */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
            <div>
              <p className="font-semibold text-green-400">Order placed successfully!</p>
              <p className="text-sm text-green-400/70">Thank you for your purchase. We'll send you updates via email.</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/account/orders" className="text-brand-500 hover:text-accent-400">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-display text-white">Order #{order.orderNumber}</h1>
              <p className="text-sm text-brand-500">Placed on {formatDateTime(order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', getOrderStatusColor(orderStatus))}>
              {isCancelled ? 'Cancelled' : orderStatus?.replace(/_/g, ' ')}
            </span>
            {canRetryPayment && (
              <Button size="sm" onClick={handleRetryPayment} isLoading={isRetrying}>
                <RefreshCw size={14} className="mr-1" />
                Retry Payment
              </Button>
            )}
            {canCancel && (
              <Button variant="danger" size="sm" onClick={handleCancel} isLoading={cancelOrder.isPending}>
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Progress tracker */}
        {!isCancelled && (
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10">
                <div
                  className="h-full bg-accent-500 transition-all"
                  style={{ width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%` }}
                />
              </div>
              {statusSteps.map((step, i) => {
                const isActive = i <= currentStepIndex;
                return (
                  <div key={step.key} className="relative flex flex-col items-center z-10">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition',
                      isActive ? 'bg-accent-500 text-white' : 'bg-white/5 text-brand-600'
                    )}>
                      <step.icon size={18} />
                    </div>
                    <span className={cn('text-xs mt-2 font-medium', isActive ? 'text-accent-400' : 'text-brand-500')}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
              <h2 className="font-semibold text-white mb-4">Order Items ({order.items?.length})</h2>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    {item.productImage ? (
                      <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-white/5 rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {item.productName || item.product?.name || 'Product'}
                      </p>
                      <div className="text-xs text-brand-500 mt-1 space-x-3">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-white">{formatPrice(item.price)}</span>
                        <span className="text-xs text-brand-500">× {item.quantity} = {formatPrice(item.subtotal || item.total)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-accent-500" />
                Shipping Address
              </h2>
              {(order.address || (order as any).shippingAddress) && (() => {
                const addr = order.address || (order as any).shippingAddress;
                return (
                  <div className="text-sm text-brand-400">
                    <p className="font-medium text-white">{addr.fullName}</p>
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>{addr.city}, {addr.state} - {addr.pinCode}</p>
                    <p className="mt-1 flex items-center gap-1"><Phone size={12} /> {addr.phone}</p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="space-y-6">
            <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
              <h2 className="font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-brand-500">Subtotal</span><span className="text-white">{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-brand-500">Shipping</span><span className="text-white">{Number(order.shippingCharge || (order as any).shippingCost) > 0 ? formatPrice(order.shippingCharge || (order as any).shippingCost) : 'Free'}</span></div>
                <div className="flex justify-between"><span className="text-brand-500">Tax (GST 18%)</span><span className="text-white">{formatPrice(order.tax)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-400"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>
                )}
                <hr className="my-2 border-white/10" />
                <div className="flex justify-between font-bold text-lg text-white">
                  <span>Total</span><span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6">
              <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
                <CreditCard size={16} className="text-accent-500" />
                Payment
              </h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-brand-500">Method</span>
                  <span className="font-medium text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-500">Status</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getPaymentStatusColor(order.paymentStatus))}>
                    {order.paymentStatus}
                  </span>
                </div>
                {canRetryPayment && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-amber-400 mb-2">Payment is pending. Click below to complete payment.</p>
                    <Button size="sm" fullWidth onClick={handleRetryPayment} isLoading={isRetrying}>
                      <RefreshCw size={14} className="mr-1" />
                      Complete Payment
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-accent-500/10 rounded-2xl p-4 text-center border border-accent-500/20">
              <p className="text-sm text-brand-300">Need help with this order?</p>
              <Link href="/contact" className="text-sm font-medium text-accent-400 hover:underline">
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
