import { SITE_NAME, CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen py-16">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-display text-white mb-8">Privacy Policy</h1>
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 prose prose-invert max-w-none">
          <p className="text-brand-500 text-sm mb-6">Last updated: January 15, 2024</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email, phone number, shipping address, and payment details during checkout.</p>
          <p>We automatically collect: browser type, IP address, pages visited, and cookies for a better shopping experience.</p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send order updates and shipping notifications</li>
            <li>Provide customer support</li>
            <li>Improve our website and services</li>
            <li>Send promotional offers (with your consent)</li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>We do not sell your personal data. We share information only with:</p>
          <ul>
            <li>Payment processors (Razorpay) for secure transactions</li>
            <li>Shipping partners for order delivery</li>
            <li>Analytics tools to improve our service</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>We use industry-standard encryption (SSL/TLS) and security measures to protect your data. Payment information is processed securely through Razorpay and never stored on our servers.</p>

          <h2>5. Cookies</h2>
          <p>We use cookies to maintain your login session, remember cart items, and analyze site traffic. You can disable cookies in your browser settings.</p>

          <h2>6. Your Rights</h2>
          <p>You can access, update, or delete your personal information from your account settings. Contact us at {CONTACT_INFO.email} for data-related requests.</p>

          <h2>7. Contact Us</h2>
          <p>For privacy concerns, reach us at:</p>
          <p>Email: {CONTACT_INFO.email}<br />Phone: {CONTACT_INFO.phone}</p>
        </div>
      </div>
    </div>
  );
}
