import { CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Shipping Policy',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-display text-white mb-8">Shipping Policy</h1>
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 prose prose-invert max-w-none">
          <p className="text-brand-500 text-sm mb-6">Last updated: January 15, 2024</p>

          <h2>🚚 Delivery Coverage</h2>
          <p>We deliver across India to all serviceable PIN codes via reputed courier partners.</p>

          <h2>💰 Shipping Charges</h2>
          <table>
            <thead>
              <tr><th>Order Value</th><th>Shipping Cost</th></tr>
            </thead>
            <tbody>
              <tr><td>Above ₹999</td><td><strong>FREE</strong></td></tr>
              <tr><td>Below ₹999</td><td>₹99</td></tr>
            </tbody>
          </table>

          <h2>⏰ Delivery Timeframes</h2>
          <table>
            <thead>
              <tr><th>Location</th><th>Estimated Time</th></tr>
            </thead>
            <tbody>
              <tr><td>Metro Cities</td><td>3-5 business days</td></tr>
              <tr><td>Tier 2/3 Cities</td><td>5-7 business days</td></tr>
              <tr><td>Remote Areas</td><td>7-10 business days</td></tr>
            </tbody>
          </table>

          <h2>📦 Order Processing</h2>
          <ul>
            <li>Orders are processed within 1-2 business days</li>
            <li>Tracking details will be shared via email and SMS</li>
            <li>Business days exclude Sundays and public holidays</li>
          </ul>

          <h2>📍 Tracking Your Order</h2>
          <p>Once shipped, you'll receive a tracking number via email. You can also track orders from your account dashboard under "My Orders."</p>

          <h2>⚠️ Important Notes</h2>
          <ul>
            <li>Delivery to PO Box addresses is not available</li>
            <li>COD orders may take an additional 1-2 days for verification</li>
            <li>During sale events, delivery may take slightly longer due to high volume</li>
          </ul>

          <h2>📞 Need Help?</h2>
          <p>Contact us at {CONTACT_INFO.email} or call {CONTACT_INFO.phone} for shipping queries.</p>
        </div>
      </div>
    </div>
  );
}
