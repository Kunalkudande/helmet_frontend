import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Blog - Motorcycle Safety Tips & Helmet Guides | ${SITE_NAME}`,
  description:
    'Read expert articles on motorcycle safety, helmet buying guides, riding tips, gear reviews and more from Bikers Brain.',
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description:
      'Expert articles on motorcycle safety, helmet guides, and riding tips.',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
