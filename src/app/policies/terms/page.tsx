import { CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Terms & Conditions',
};

export default function TermsPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-display text-white mb-8">Terms & Conditions</h1>
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 prose prose-invert max-w-none">
          <p className="text-brand-500 text-sm mb-6">Last updated: January 15, 2024</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using HelmetStore, you agree to be bound by these Terms and Conditions.</p>

          <h2>2. Products</h2>
          <p>All helmets listed on our website are genuine products from authorized brand distributors. Product images are for illustration and may slightly vary from actual products.</p>

          <h2>3. Pricing</h2>
          <p>All prices are in Indian Rupees (INR) and include applicable taxes (GST 18%). Prices are subject to change without prior notice. The price at the time of order placement will be honored.</p>

          <h2>4. Orders</h2>
          <ul>
            <li>Orders are subject to product availability</li>
            <li>We reserve the right to cancel orders due to pricing errors or stock unavailability</li>
            <li>Order confirmation will be sent via email</li>
          </ul>

          <h2>5. Payment</h2>
          <p>We accept payments via Razorpay (UPI, cards, net banking, wallets) and Cash on Delivery (COD). All online payments are processed through Razorpay's secure gateway.</p>

          <h2>6. Shipping</h2>
          <p>Free shipping on orders above ₹999. Standard shipping charge of ₹99 applies for orders below this amount. Delivery within 5-7 business days across India.</p>

          <h2>7. Intellectual Property</h2>
          <p>All content on this website, including text, images, logos, and designs, is our intellectual property and may not be reproduced without permission.</p>

          <h2>8. Limitation of Liability</h2>
          <p>HelmetStore shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>

          <h2>9. Governing Law</h2>
          <p>These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in Mumbai, Maharashtra.</p>

          <h2>10. Contact</h2>
          <p>Email: {CONTACT_INFO.email}<br />Phone: {CONTACT_INFO.phone}</p>
        </div>
      </div>
    </div>
  );
}
