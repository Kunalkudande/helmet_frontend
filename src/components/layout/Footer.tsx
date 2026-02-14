'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  NAV_LINKS,
  CATEGORIES,
  CONTACT_INFO,
  SOCIAL_LINKS,
  SITE_NAME,
  IMAGES,
} from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Helmets', href: '/products' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Best Sellers', href: '/products?sort=popular' },
      { label: 'On Sale', href: '/products?sale=true' },
    ],
    categories: CATEGORIES.slice(0, 4).map((cat) => ({
      label: cat.label,
      href: `/products?category=${cat.value}`,
    })),
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
    ],
    support: [
      { label: 'Help Center', href: '/contact' },
      { label: 'Shipping', href: '/shipping-policy' },
      { label: 'Returns', href: '/return-policy' },
      { label: 'Track Order', href: '/account/orders' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy-policy' },
      { label: 'Terms', href: '/terms' },
    ],
  };

  return (
    <footer className="bg-[hsl(0,0%,4%)] text-white relative overflow-hidden">
      {/* Top orange accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />

      {/* Main Footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <Image src={IMAGES.logoDark} alt={SITE_NAME} width={32} height={32} className="w-8 h-8" />
              <span className="text-lg font-bold tracking-tight">
                <span className="text-accent-500">BIKERS</span>{' '}
                <span className="text-white">BRAIN</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 mb-8 max-w-xs leading-relaxed">
              Premium ISI & DOT certified motorcycle helmets. Curated for riders who demand safety, style, and performance.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-accent-500 hover:border-accent-500/30 hover:bg-accent-500/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-accent-500 hover:border-accent-500/30 hover:bg-accent-500/10 transition-all duration-300"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-accent-500 hover:border-accent-500/30 hover:bg-accent-500/10 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg tracking-wide text-white mb-5">SHOP</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/35 hover:text-accent-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg tracking-wide text-white mb-5">CATEGORIES</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/35 hover:text-accent-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg tracking-wide text-white mb-5">SUPPORT</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/35 hover:text-accent-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg tracking-wide text-white mb-5">CONTACT</h4>
            <ul className="space-y-3 text-sm text-white/35">
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-accent-500 transition-colors duration-200">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-accent-500 transition-colors duration-200">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="text-white/25">{CONTACT_INFO.address}</li>
              <li className="text-white/25">{CONTACT_INFO.workingHours}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container-custom py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20">
              &copy; {currentYear} {SITE_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-white/20 hover:text-accent-500 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
