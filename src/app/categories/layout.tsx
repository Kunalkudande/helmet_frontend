import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Helmet Categories | ${SITE_NAME}`,
  description:
    'Browse motorcycle helmet categories — Full Face, Half Face, Open Face, Modular, Off Road, Kids, and Ladies helmets. Find the perfect helmet for your riding style.',
  openGraph: {
    title: `Helmet Categories | ${SITE_NAME}`,
    description:
      'Browse motorcycle helmet categories at Bikers Brain. Find the perfect helmet for your riding style.',
  },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
