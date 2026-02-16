import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Shop Motorcycle Helmets | ${SITE_NAME}`,
  description:
    'Shop premium ISI & DOT certified motorcycle helmets online. Full Face, Half Face, Modular and more from top brands like Vega, Steelbird, Studds, LS2.',
  openGraph: {
    title: `Shop Motorcycle Helmets | ${SITE_NAME}`,
    description:
      'Shop premium certified motorcycle helmets online at Bikers Brain.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
