import Link from 'next/link';
import { ChevronLeft, RotateCcw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-accent-400 mb-6">
          <ChevronLeft size={16} /> Back to Home
        </Link>
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 md:p-12 max-w-3xl mx-auto">
          <h1 className="text-3xl font-display text-white mb-6">Return & Refund Policy</h1>
          <div className="prose prose-sm max-w-none text-brand-400 space-y-6">
            <p className="text-sm text-brand-500">Last updated: February 2026</p>

            <div className="not-prose bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-3 mb-6">
              <RotateCcw className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-green-400">7-Day Easy Returns</p>
                <p className="text-sm text-green-400/70">We offer hassle-free returns within 7 days of delivery. No questions asked.</p>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white">1. Return Eligibility</h2>
            <div className="not-prose space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-brand-400">Product must be unused and in original packaging</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-brand-400">Return request must be raised within 7 days of delivery</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-brand-400">All tags and labels must be intact</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-brand-400">Used or damaged helmets are not eligible for return</span>
              </div>
              <div className="flex items-start gap-2">
                <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-brand-400">Products purchased during clearance sales are final</span>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white">2. How to Return</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Go to your Orders page and select the order</li>
              <li>Click &quot;Request Return&quot; and provide a reason</li>
              <li>Our team will arrange a pickup within 2 business days</li>
              <li>Refund will be processed within 5–7 business days after we receive the item</li>
            </ol>

            <h2 className="text-lg font-semibold text-white">3. Refund Methods</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Online payments: Refunded to original payment method</li>
              <li>COD orders: Refunded via bank transfer (NEFT/IMPS)</li>
            </ul>

            <h2 className="text-lg font-semibold text-white">4. Exchanges</h2>
            <p>If you need a different size or color, you can request an exchange. Subject to stock availability. Exchange shipping is free.</p>

            <div className="not-prose bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-amber-400">Need Help?</p>
                <p className="text-sm text-amber-400/70">Contact us at <a href="mailto:support@helmetstore.com" className="underline">support@helmetstore.com</a> or call +91-9876543210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
