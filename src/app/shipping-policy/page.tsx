import Link from 'next/link';
import { ChevronLeft, Truck, Package, Clock } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-accent-400 mb-6">
          <ChevronLeft size={16} /> Back to Home
        </Link>
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 md:p-12 max-w-3xl mx-auto">
          <h1 className="text-3xl font-display text-white mb-6">Shipping Policy</h1>
          <div className="prose prose-sm max-w-none text-brand-400 space-y-6">
            <p className="text-sm text-brand-500">Last updated: February 2026</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-8">
              <div className="bg-accent-500/10 rounded-xl p-4 text-center border border-accent-500/20">
                <Truck className="mx-auto text-accent-500 mb-2" size={24} />
                <p className="text-sm font-semibold text-white">Free Shipping</p>
                <p className="text-xs text-brand-500">Orders above ₹999</p>
              </div>
              <div className="bg-accent-500/10 rounded-xl p-4 text-center border border-accent-500/20">
                <Package className="mx-auto text-accent-500 mb-2" size={24} />
                <p className="text-sm font-semibold text-white">Pan-India</p>
                <p className="text-xs text-brand-500">We deliver everywhere</p>
              </div>
              <div className="bg-accent-500/10 rounded-xl p-4 text-center border border-accent-500/20">
                <Clock className="mx-auto text-accent-500 mb-2" size={24} />
                <p className="text-sm font-semibold text-white">3-7 Days</p>
                <p className="text-xs text-brand-500">Standard delivery</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white">1. Shipping Charges</h2>
            <p>Orders above ₹999 qualify for free shipping. For orders below ₹999, a flat shipping fee of ₹99 is charged.</p>

            <h2 className="text-lg font-semibold text-white">2. Delivery Timeframes</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Metro cities: 3–5 business days</li>
              <li>Tier 2 cities: 4–6 business days</li>
              <li>Other locations: 5–7 business days</li>
            </ul>

            <h2 className="text-lg font-semibold text-white">3. Order Tracking</h2>
            <p>Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order from the Orders section of your account.</p>

            <h2 className="text-lg font-semibold text-white">4. Shipping Partners</h2>
            <p>We work with trusted logistics partners including Delhivery, Blue Dart, and DTDC to ensure safe and timely delivery of your helmets.</p>

            <h2 className="text-lg font-semibold text-white">5. Damaged in Transit</h2>
            <p>If your order arrives damaged, please contact us within 24 hours with photos. We will arrange a free replacement or full refund.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
