import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `About Us | ${SITE_NAME}`,
  description:
    'Learn about Bikers Brain — your trusted destination for premium ISI & DOT certified motorcycle helmets. Safety, style, and expert curation for every rider.',
  openGraph: {
    title: `About Us | ${SITE_NAME}`,
    description:
      'Learn about Bikers Brain — your trusted destination for premium ISI & DOT certified motorcycle helmets.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
