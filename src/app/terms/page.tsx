import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-accent-400 mb-6">
          <ChevronLeft size={16} /> Back to Home
        </Link>
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 md:p-12 max-w-3xl mx-auto">
          <h1 className="text-3xl font-display text-white mb-6">Terms & Conditions</h1>
          <div className="prose prose-sm max-w-none text-brand-400 space-y-6">
            <p className="text-sm text-brand-500">Last updated: February 2026</p>

            <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
            <p>By accessing and using HelmetStore, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.</p>

            <h2 className="text-lg font-semibold text-white">2. Products & Pricing</h2>
            <p>All products listed are subject to availability. Prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise. We reserve the right to modify prices without prior notice.</p>

            <h2 className="text-lg font-semibold text-white">3. Orders & Payment</h2>
            <p>By placing an order, you confirm that all details provided are accurate. We accept payments via Razorpay (UPI, cards, net banking) and Cash on Delivery for eligible orders.</p>

            <h2 className="text-lg font-semibold text-white">4. Shipping</h2>
            <p>We ship across India. Free shipping is available on orders above ₹999. Delivery times may vary based on your location. Standard delivery takes 3–7 business days.</p>

            <h2 className="text-lg font-semibold text-white">5. Account Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility.</p>

            <h2 className="text-lg font-semibold text-white">6. Intellectual Property</h2>
            <p>All content on this website, including text, images, and logos, is the property of HelmetStore and is protected by copyright laws.</p>

            <h2 className="text-lg font-semibold text-white">7. Limitation of Liability</h2>
            <p>HelmetStore shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>

            <h2 className="text-lg font-semibold text-white">8. Contact</h2>
            <p>For questions about these terms, email us at <a href="mailto:support@helmetstore.com" className="text-accent-400 hover:underline">support@helmetstore.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
