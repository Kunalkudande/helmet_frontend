import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Contact Us | ${SITE_NAME}`,
  description:
    'Get in touch with Bikers Brain. We\'re here to help you find the perfect motorcycle helmet. Reach out for queries, support, or bulk orders.',
  openGraph: {
    title: `Contact Us | ${SITE_NAME}`,
    description:
      'Get in touch with Bikers Brain for queries, support, or bulk orders.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
