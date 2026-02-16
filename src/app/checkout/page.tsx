'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MapPin, CreditCard, Truck, ChevronRight, Plus, Check, Tag,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useCreateOrder, useVerifyPayment } from '@/hooks/useOrders';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { CartSummary } from '@/components/cart/CartSummary';
import { formatPrice, cn } from '@/lib/utils';
import { INDIAN_STATES, PAYMENT_METHODS, FREE_SHIPPING_THRESHOLD, SHIPPING_COST, GST_RATE } from '@/lib/constants';
import { openRazorpayCheckout } from '@/lib/razorpay';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { Address, PaymentMethod } from '@/types';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid PIN code'),
  addressType: z.enum(['HOME', 'OFFICE']),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, totalPrice, isEmpty, fetchCart } = useCart();
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('RAZORPAY');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{ order: any; razorpayOrder: any } | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { addressType: 'HOME' },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get('/users/addresses');
        const data = response.data.data;
        const addrList = Array.isArray(data) ? data : data.addresses || [];
        setAddresses(addrList);
        const defaultAddr = addrList.find((a: Address) => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      } catch (error) {}
    };
    if (isAuthenticated) fetchAddresses();
  }, [isAuthenticated]);

  // Redirect if cart is empty (but not if we have a pending payment to retry or completed order)
  useEffect(() => {
    if (!authLoading && isAuthenticated && isEmpty && !pendingOrder && !orderCompleted) {
      router.push('/cart');
    }
  }, [isEmpty, isAuthenticated, authLoading, router, pendingOrder, orderCompleted]);

  const handleAddAddress = async (data: AddressFormData) => {
    try {
      const response = await api.post('/users/addresses', data);
      const newAddress = response.data.data.address || response.data.data;
      setAddresses([...addresses, newAddress]);
      setSelectedAddressId(newAddress.id);
      setShowNewAddressForm(false);
      reset();
      toast.success('Address added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add address');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const response = await api.post('/orders/validate-coupon', {
        couponCode: couponCode.trim().toUpperCase(),
        subtotal: totalPrice,
      });
      const { code, discount, discountType, discountValue } = response.data.data;
      setAppliedCoupon(code);
      setCouponDiscount(discount);
      const discountLabel = discountType === 'PERCENTAGE' ? `${discountValue}%` : `₹${discountValue}`;
      toast.success(`Coupon ${code} applied! You save ${formatPrice(discount)}`);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Invalid coupon code';
      toast.error(msg);
      setAppliedCoupon('');
      setCouponDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  // Open Razorpay checkout for an existing order
  const openPaymentModal = (order: any, razorpayOrder: any) => {
    openRazorpayCheckout({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      prefill: {
        name: user?.fullName || '',
        email: user?.email,
        contact: user?.phone,
      },
      onSuccess: async (paymentResponse) => {
        try {
          setOrderCompleted(true);
          await verifyPayment.mutateAsync({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            orderId: order.id,
          });
          setPendingOrder(null);
          fetchCart(); // refresh cart (now cleared by backend)
          router.push(`/account/orders/${order.id}?success=true`);
        } catch (error) {
          toast.error('Payment verification failed. Please contact support.');
          setIsProcessing(false);
        }
      },
      onFailure: (error) => {
        const reason = error?.description || error?.reason || error?.message || 'Payment failed';
        // error silently handled by onFailure
        toast.error(`Payment failed: ${reason}. You can retry from your orders page.`);
        setIsProcessing(false);
        setPendingOrder(null);
        router.push(`/account/orders/${order.id}`);
      },
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    // Prevent double-click
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // If we already have a pending RAZORPAY order, retry payment directly
      if (pendingOrder && paymentMethod === 'RAZORPAY') {
        openPaymentModal(pendingOrder.order, pendingOrder.razorpayOrder);
        return;
      }

      const orderData = {
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: appliedCoupon || undefined,
      };

      const response = await createOrder.mutateAsync(orderData);
      const { order, razorpayOrder } = response;

      console.log('Order created:', order?.id);
      console.log('Razorpay order:', razorpayOrder);

      if (paymentMethod === 'RAZORPAY' && razorpayOrder) {
        // Save pending order for retry capability
        setPendingOrder({ order, razorpayOrder });
        openPaymentModal(order, razorpayOrder);
      } else {
        // COD order — cart already cleared by backend
        setOrderCompleted(true);
        fetchCart(); // refresh cart
        toast.success('Order placed successfully!');
        router.push(`/account/orders/${order.id}?success=true`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to place order');
      setIsProcessing(false);
    }
  };

  if (authLoading || (isEmpty && !pendingOrder)) return null;

  const subtotal = totalPrice;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * GST_RATE);

  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        <h1 className="text-2xl font-display text-white mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Review' },
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <button
                onClick={() => setStep(s.num as 1 | 2 | 3)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition',
                  step >= s.num ? 'bg-accent-500 text-white' : 'bg-white/5 text-brand-500 border border-white/10'
                )}
              >
                {step > s.num ? <Check size={16} /> : <span>{s.num}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < 2 && <ChevronRight size={16} className="text-brand-600" />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step 1: Address */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Select Delivery Address</h2>

                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={cn(
                      'block bg-white/[0.03] rounded-xl border p-4 cursor-pointer transition',
                      selectedAddressId === addr.id ? 'border-accent-500 bg-accent-500/5' : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 w-4 h-4 text-accent-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{addr.fullName}</span>
                        <span className="text-xs bg-white/5 text-brand-400 px-2 py-0.5 rounded">{addr.addressType}</span>
                          {addr.isDefault && <span className="text-xs bg-accent-500/10 text-accent-400 px-2 py-0.5 rounded">Default</span>}
                        </div>
                        <p className="text-sm text-brand-400 mt-1">
                          {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        </p>
                        <p className="text-sm text-brand-400">
                          {addr.city}, {addr.state} - {addr.pinCode}
                        </p>
                        <p className="text-sm text-brand-500 mt-1">📞 {addr.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}

                {!showNewAddressForm ? (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="flex items-center gap-2 w-full p-4 bg-white/[0.03] rounded-xl border-2 border-dashed border-white/10 text-sm font-medium text-brand-400 hover:border-accent-500/40 hover:text-accent-400 transition"
                  >
                    <Plus size={18} />
                    Add New Address
                  </button>
                ) : (
                  <div className="bg-white/[0.03] rounded-xl border border-white/10 p-6">
                    <h3 className="font-semibold text-white mb-4">New Address</h3>
                    <form onSubmit={handleSubmit(handleAddAddress)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
                        <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
                      </div>
                      <Input label="Address Line 1" error={errors.addressLine1?.message} {...register('addressLine1')} />
                      <Input label="Address Line 2" error={errors.addressLine2?.message} {...register('addressLine2')} />
                      <div className="grid grid-cols-3 gap-4">
                        <Input label="City" error={errors.city?.message} {...register('city')} />
                        <Select
                          label="State"
                          options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                          placeholder="Select State"
                          error={errors.state?.message}
                          {...register('state')}
                        />
                        <Input label="PIN Code" error={errors.pinCode?.message} {...register('pinCode')} />
                      </div>
                      <Select
                        label="Address Type"
                        options={[
                          { value: 'HOME', label: 'Home' },
                          { value: 'OFFICE', label: 'Office' },
                        ]}
                        {...register('addressType')}
                      />
                      <div className="flex gap-3">
                        <Button type="submit">Save Address</Button>
                        <Button variant="ghost" onClick={() => { setShowNewAddressForm(false); reset(); }}>Cancel</Button>
                      </div>
                    </form>
                  </div>
                )}

                <Button onClick={() => setStep(2)} fullWidth size="lg" disabled={!selectedAddressId}>
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Payment Method</h2>

                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={cn(
                      'block bg-white/[0.03] rounded-xl border p-4 cursor-pointer transition',
                      paymentMethod === method.value ? 'border-accent-500 bg-accent-500/5' : 'border-white/10 hover:border-white/20'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === method.value}
                        onChange={() => setPaymentMethod(method.value as PaymentMethod)}
                        className="w-4 h-4 text-accent-500"
                      />
                      <div>
                        <span className="font-medium text-white">{method.label}</span>
                        <p className="text-xs text-brand-500">{method.description}</p>
                      </div>
                    </div>
                  </label>
                ))}

                {/* Coupon */}
                <div className="bg-white/[0.03] rounded-xl border border-white/10 p-4">
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Tag size={16} className="text-accent-500" />
                    Have a coupon?
                  </h3>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div>
                        <p className="text-sm font-semibold text-green-400">✅ {appliedCoupon} applied</p>
                        <p className="text-xs text-green-400/70">You save {formatPrice(couponDiscount)}</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={handleApplyCoupon} isLoading={couponLoading} disabled={couponLoading}>
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)} fullWidth size="lg">Review Order</Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Review Your Order</h2>

                {/* Delivery address */}
                <div className="bg-white/[0.03] rounded-xl border border-white/10 p-4">
                  <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-accent-500" />
                    Delivery Address
                  </h3>
                  {(() => {
                    const addr = addresses.find((a) => a.id === selectedAddressId);
                    if (!addr) return <p className="text-brand-500">No address selected</p>;
                    return (
                      <div className="text-sm text-brand-400">
                        <p className="font-semibold text-white">{addr.fullName}</p>
                        <p>{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p>{addr.city}, {addr.state} - {addr.pinCode}</p>
                        <p>📞 {addr.phone}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Payment method */}
                <div className="bg-white/[0.03] rounded-xl border border-white/10 p-4">
                  <h3 className="font-medium text-white mb-2 flex items-center gap-2">
                    <CreditCard size={16} className="text-accent-500" />
                    Payment
                  </h3>
                  <p className="text-sm text-brand-400">
                    {PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label}
                  </p>
                </div>

                {/* Order items */}
                <div className="bg-white/[0.03] rounded-xl border border-white/10 p-4">
                  <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                    <Truck size={16} className="text-accent-500" />
                    Items ({items.length})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => {
                      const itemPrice = item.product.discountPrice
                        ? Number(item.product.discountPrice)
                        : Number(item.product.price);
                      const variantExtra = item.variant?.additionalPrice ? Number(item.variant.additionalPrice) : 0;
                      const itemTotal = (itemPrice + variantExtra) * item.quantity;
                      return (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <div className="w-12 h-12 bg-white/5 rounded-lg flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{item.product.name}</p>
                            <p className="text-xs text-brand-500">
                              Qty: {item.quantity}
                              {item.variant?.size && ` | Size: ${item.variant.size}`}
                              {item.variant?.color && ` | ${item.variant.color}`}
                            </p>
                          </div>
                          <span className="font-semibold">{formatPrice(itemTotal)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                  <Button onClick={handlePlaceOrder} fullWidth size="lg" isLoading={isProcessing}>
                    {pendingOrder ? 'Retry Payment' : paymentMethod === 'COD' ? 'Place Order (COD)' : 'Pay & Place Order'}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary
                subtotal={subtotal}
                itemCount={items.length}
                onCheckout={handlePlaceOrder}
                isLoading={isProcessing}
                couponDiscount={couponDiscount}
                couponCode={appliedCoupon}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
