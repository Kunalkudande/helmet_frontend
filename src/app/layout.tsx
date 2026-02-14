import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { VisitorTracker } from '@/components/providers/VisitorTracker';
import { Toaster } from 'react-hot-toast';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL, IMAGES } from '@/lib/constants';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Premium Motorcycle Helmets in India`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'motorcycle helmets',
    'bike helmets',
    'helmet online India',
    'full face helmet',
    'half face helmet',
    'ISI certified helmet',
    'DOT certified helmet',
    'Vega helmets',
    'Steelbird helmets',
    'Studds helmets',
    'LS2 helmets',
  ],
  authors: [{ name: 'HelmetStore' }],
  creator: 'HelmetStore',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Premium Motorcycle Helmets in India`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: IMAGES.ogImage,
        width: 1200,
        height: 630,
        alt: 'Bikers Brain - Premium Motorcycle Helmets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Premium Motorcycle Helmets in India`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: '/updated_images/bikersbrain-logo.png',
    apple: '/updated_images/bikersbrain-logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} min-h-screen flex flex-col bg-[hsl(0,0%,5%)] text-white`}>
        <Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#171717',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#16A34A',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#DC2626',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Header />
          <CartDrawer />
          <VisitorTracker />
          <main className="flex-1">{children}</main>
          <Footer />
          {/* Global structured data for brand & website */}
          <Script
            id="ld-json-website"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: SITE_NAME,
                url: SITE_URL,
                potentialAction: {
                  '@type': 'SearchAction',
                  target: `${SITE_URL}/products?search={search_term_string}`,
                  'query-input': 'required name=search_term_string',
                },
              }),
            }}
          />
          <Script
            id="ld-json-organization"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: SITE_NAME,
                url: SITE_URL,
                logo: `${SITE_URL}/og-image.jpg`,
              }),
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
