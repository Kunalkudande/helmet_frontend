import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      <div className="container-custom py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-brand-500 hover:text-accent-400 mb-6">
          <ChevronLeft size={16} /> Back to Home
        </Link>
        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8 md:p-12 max-w-3xl mx-auto">
          <h1 className="text-3xl font-display text-white mb-6">Privacy Policy</h1>
          <div className="prose prose-sm max-w-none text-brand-400 space-y-6">
            <p className="text-sm text-brand-500">Last updated: February 2026</p>

            <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
            <p>When you create an account, place an order, or interact with our website, we may collect personal information such as your name, email address, phone number, shipping address, and payment details.</p>

            <h2 className="text-lg font-semibold text-white">2. How We Use Your Information</h2>
            <p>We use the information we collect to process orders, communicate with you about your purchases, improve our services, and send promotional offers (with your consent).</p>

            <h2 className="text-lg font-semibold text-white">3. Data Security</h2>
            <p>We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information.</p>

            <h2 className="text-lg font-semibold text-white">4. Cookies</h2>
            <p>Our website uses cookies to enhance your browsing experience. You can control cookie preferences through your browser settings.</p>

            <h2 className="text-lg font-semibold text-white">5. Third-Party Services</h2>
            <p>We may share your information with trusted third-party services for payment processing (Razorpay), shipping, and analytics. These partners are bound by their own privacy policies.</p>

            <h2 className="text-lg font-semibold text-white">6. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal data at any time through your account settings or by contacting us.</p>

            <h2 className="text-lg font-semibold text-white">7. Contact Us</h2>
            <p>For any privacy-related questions, contact us at <a href="mailto:support@helmetstore.com" className="text-accent-400 hover:underline">support@helmetstore.com</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
