import { CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Return & Refund Policy',
};

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-display text-white mb-8">Return & Refund Policy</h1>
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 prose prose-invert max-w-none">
          <p className="text-brand-500 text-sm mb-6">Last updated: January 15, 2024</p>

          <h2>↩️ Return Window</h2>
          <p>We offer a <strong>7-day return window</strong> from the date of delivery for all products. The product must be unused, in original packaging, and with all tags intact.</p>

          <h2>✅ Eligible for Return</h2>
          <ul>
            <li>Wrong size delivered</li>
            <li>Defective or damaged product</li>
            <li>Product doesn't match description</li>
            <li>Wrong product delivered</li>
          </ul>

          <h2>❌ Not Eligible for Return</h2>
          <ul>
            <li>Products used or worn (with visible signs of use)</li>
            <li>Products without original packaging and tags</li>
            <li>Products returned after 7 days of delivery</li>
            <li>Sale/clearance items (unless defective)</li>
          </ul>

          <h2>🔄 Return Process</h2>
          <ol>
            <li>Log into your account and go to "My Orders"</li>
            <li>Select the order and click "Request Return"</li>
            <li>Choose the reason for return</li>
            <li>Our team will review and approve within 24 hours</li>
            <li>Schedule a pickup or drop off at the nearest courier center</li>
          </ol>

          <h2>💰 Refund Process</h2>
          <table>
            <thead>
              <tr><th>Payment Method</th><th>Refund Timeline</th></tr>
            </thead>
            <tbody>
              <tr><td>UPI / Net Banking</td><td>5-7 business days</td></tr>
              <tr><td>Credit / Debit Card</td><td>7-10 business days</td></tr>
              <tr><td>Cash on Delivery</td><td>Bank transfer within 7-10 days</td></tr>
            </tbody>
          </table>

          <h2>🔁 Exchange</h2>
          <p>Want a different size? We offer free exchanges for size-related returns. Simply request an exchange instead of a refund, and we'll ship the correct size once we receive the original product.</p>

          <h2>📞 Need Help?</h2>
          <p>For return or refund queries, contact us at:</p>
          <p>Email: {CONTACT_INFO.email}<br />Phone: {CONTACT_INFO.phone}</p>
        </div>
      </div>
    </div>
  );
}
