'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Star,
  ShoppingCart,
  ChevronRight,
  Zap,
  Award,
  Eye,
} from 'lucide-react';
import { useFeaturedProducts, useCategoryCounts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, BRANDS, IMAGES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ─── dark category images ─── */
const DARK_CATEGORIES = [
  { value: 'FULL_FACE', label: 'Full Face', desc: 'Maximum protection for serious riders', image: '/updated_images/helmet-fullface.jpg' },
  { value: 'MODULAR', label: 'Modular', desc: 'Versatile flip-up for touring', image: '/updated_images/helmet-modular.jpg' },
  { value: 'HALF_FACE', label: 'Half Face', desc: 'Lightweight freedom on every road', image: '/updated_images/helmet-halfface.jpg' },
  { value: 'OFF_ROAD', label: 'Off-Road', desc: 'Built for dirt, dust & adventure', image: '/updated_images/helmet-offroad.jpg' },
];

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts();
  const { data: categoryCounts } = useCategoryCounts();
  const { addToCart } = useCartStore();

  const totalProducts = categoryCounts
    ? Object.values(categoryCounts).reduce((sum, c) => sum + c, 0)
    : 0;

  const stats = [
    { number: totalProducts > 0 ? `${totalProducts}+` : '...', label: 'Helmets' },
    { number: '50+', label: 'Brands' },
    { number: '10K+', label: 'Happy Riders' },
  ];

  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'ISI & DOT Certified',
      description: 'Every helmet meets international safety standards. Your protection is non-negotiable.',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Complimentary delivery on all orders above ₹999. Fast & insured shipping across India.',
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Returns',
      description: 'Not the right fit? Return within 7 days for a full refund. Zero hassle guaranteed.',
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Our gear specialists are here to help you find the perfect lid. Chat or call anytime.',
    },
  ];

  return (
    <div className="bg-[hsl(0,0%,5%)] -mt-16 lg:-mt-18">
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background image + gradient overlay */}
        <div className="absolute inset-0">
          <Image
            src="/updated_images/hero-helmet.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(0,0%,5%)] via-[hsl(0,0%,5%)]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,5%)] via-transparent to-[hsl(0,0%,5%)]/30" />
        </div>

        {/* Noise texture */}
        <div className="absolute inset-0 noise-overlay" />

        {/* Animated orange glow orbs */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] bg-accent-500/3 rounded-full blur-[80px]" />

        <div className="container-custom relative z-10 py-20 lg:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent-500/10 border border-accent-500/20 rounded-full mb-8"
            >
              <Zap size={14} className="text-accent-500" />
              <span className="text-sm font-medium text-accent-400">New Season Collection 2026</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-display text-6xl sm:text-7xl lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.9] tracking-wide text-white mb-6"
            >
              RIDE WITH{' '}
              <span className="text-accent-500 text-glow">CONFIDENCE</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-white/50 max-w-xl mb-10 leading-relaxed"
            >
              Premium ISI & DOT certified motorcycle helmets engineered for maximum protection. 
              Curated for riders who refuse to compromise on safety or style.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center gap-4 mb-16"
            >
              <Link href="/products">
                <button className="group flex items-center gap-3 h-14 px-8 bg-accent-500 text-white font-semibold text-base rounded-xl hover:bg-accent-600 transition-all duration-300 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:scale-[1.02]">
                  Shop Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/categories">
                <button className="flex items-center gap-3 h-14 px-8 bg-transparent text-white/80 font-medium text-base rounded-xl border border-white/20 hover:border-accent-500/50 hover:text-white hover:bg-white/5 transition-all duration-300">
                  View Categories
                  <ChevronRight size={16} />
                </button>
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-8 lg:gap-12 pt-8 border-t border-white/10"
            >
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl lg:text-4xl font-display tracking-wide text-accent-500">{stat.number}</p>
                  <p className="text-sm text-white/40 mt-1">{stat.label}</p>
                </div>
              ))}
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <ShieldCheck size={18} className="text-accent-500" />
                <span className="text-xs font-medium text-white/60">ISI & DOT Certified</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-accent-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* ═══════════════════════ CATEGORIES SECTION ═══════════════════════ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(0,0%,5%)] via-[hsl(0,0%,7%)] to-[hsl(0,0%,5%)]" />
        <div className="absolute inset-0 noise-overlay" />

        <div className="container-custom relative z-10">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500 mb-4 block">Categories</span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-wide">
              SHOP BY <span className="text-accent-500 text-glow-sm">CATEGORY</span>
            </h2>
          </motion.div>

          {/* Category grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {DARK_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.value}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
              >
                <Link
                  href={`/products?category=${cat.value}`}
                  className="group relative block aspect-square rounded-2xl overflow-hidden bg-[hsl(0,0%,8%)] border border-white/5 card-hover"
                >
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-500 mb-1">{categoryCounts?.[cat.value] ? `${categoryCounts[cat.value]} Models` : ''}</span>
                    <h3 className="font-display text-3xl text-white tracking-wide mb-1">{cat.label}</h3>
                    <p className="text-sm text-white/50">{cat.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-accent-500 text-sm font-semibold opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      Explore
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FEATURED PRODUCTS ═══════════════════════ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[hsl(0,0%,5%)]" />
        <div className="absolute inset-0 noise-overlay" />
        {/* Subtle orange glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-500/3 rounded-full blur-[100px]" />

        <div className="container-custom relative z-10">
          {/* Section header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14"
          >
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500 mb-4 block">Featured</span>
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-wide">
                FEATURED <span className="text-accent-500 text-glow-sm">HELMETS</span>
              </h2>
            </div>
            <Link href="/products">
              <button className="flex items-center gap-2 text-accent-500 font-semibold text-sm hover:text-accent-400 transition-colors group">
                View All Products
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[hsl(0,0%,8%)] rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.slice(0, 8).map((product: any, i: number) => {
                const primaryImage = product.images?.find((img: any) => img.isPrimary)?.imageUrl
                  || product.images?.[0]?.imageUrl
                  || IMAGES.noProductImage;
                const hasDiscount = product.discountPrice && product.discountPrice < product.price;
                const discountPercent = hasDiscount
                  ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                  : 0;

                const badges = [];
                if (i === 0) badges.push({ label: 'Best Seller', color: 'bg-accent-500' });
                else if (i === 1) badges.push({ label: 'New', color: 'bg-green-500' });
                else if (i === 2) badges.push({ label: 'Hot', color: 'bg-red-500' });

                return (
                  <motion.div
                    key={product.id}
                    variants={scaleIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-30px' }}
                    custom={i}
                  >
                    <div className="group relative bg-[hsl(0,0%,8%)] rounded-2xl overflow-hidden border border-white/5 card-hover">
                      {/* Image */}
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {badges.map((badge) => (
                              <span
                                key={badge.label}
                                className={`${badge.color} text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md`}
                              >
                                {badge.label}
                              </span>
                            ))}
                            {discountPercent > 0 && (
                              <span className="bg-accent-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          {/* Quick view overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <span className="flex items-center gap-2 text-white text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                              <Eye size={16} /> Quick View
                            </span>
                          </div>
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="p-4">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              className={s <= (product.averageRating || 4) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}
                            />
                          ))}
                          <span className="text-xs text-white/40 ml-1">
                            ({product.reviewCount || 0})
                          </span>
                        </div>

                        <Link href={`/products/${product.slug}`}>
                          <h3 className="text-sm font-semibold text-white group-hover:text-accent-400 transition-colors line-clamp-2 mb-3">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-accent-500">
                              {formatPrice(hasDiscount ? product.discountPrice : product.price)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-white/30 line-through">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-accent-500/10 text-accent-500 hover:bg-accent-500 hover:text-white transition-all duration-200"
                            aria-label="Add to cart"
                          >
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No featured products available yet.</p>
              <Link href="/products" className="text-accent-500 font-semibold mt-4 inline-block hover:underline">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════ BRANDS MARQUEE ═══════════════════════ */}
      <section className="relative py-12 overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 bg-[hsl(0,0%,6%)]" />
        <div className="container-custom relative z-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/20 mb-8">
            Trusted by Leading Brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {BRANDS.map((brand) => (
              <Link
                key={brand}
                href={`/products?brand=${encodeURIComponent(brand)}`}
                className="font-display text-2xl lg:text-3xl tracking-wider text-white/15 hover:text-accent-500 transition-colors duration-300"
              >
                {brand.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRUST SECTION ═══════════════════════ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(0,0%,5%)] via-[hsl(0,0%,7%)] to-[hsl(0,0%,5%)]" />
        <div className="absolute inset-0 noise-overlay" />

        <div className="container-custom relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500 mb-4 block">Why Choose Us</span>
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-wide">
              BUILT FOR <span className="text-accent-500 text-glow-sm">RIDERS</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                custom={i}
                className="group relative bg-[hsl(0,0%,8%)] rounded-2xl p-7 border border-white/5 card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-6 group-hover:bg-accent-500/20 transition-colors">
                  <item.icon size={24} className="text-accent-500" />
                </div>
                <h3 className="font-display text-2xl text-white tracking-wide mb-3">{item.title.toUpperCase()}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA / NEWSLETTER ═══════════════════════ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/updated_images/helmets-collection.jpg"
            alt=""
            fill
            className="object-cover"
            loading="lazy"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        </div>
        <div className="absolute inset-0 noise-overlay" />

        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[120px]" />

        <div className="container-custom relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="max-w-3xl mx-auto text-center"
          >
            <Award size={40} className="text-accent-500 mx-auto mb-6" />
            <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-white tracking-wide mb-6 text-glow">
              GEAR UP FOR YOUR NEXT RIDE
            </h2>
            <p className="text-lg text-white/40 mb-10 max-w-xl mx-auto">
              Join our community of 1,000+ riders. Get exclusive deals, new arrivals, 
              and riding tips straight to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 h-14 px-6 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/30 transition-all"
              />
              <button className="h-14 px-8 bg-accent-500 text-white font-semibold text-sm rounded-xl hover:bg-accent-600 transition-all duration-300 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 whitespace-nowrap">
                Subscribe
              </button>
            </form>

            <p className="text-xs text-white/20 mt-6">
              No spam. Unsubscribe anytime. By subscribing you agree to our privacy policy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ FINAL CTA ═══════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[hsl(0,0%,5%)]" />
        <div className="absolute inset-0 noise-overlay" />
        
        <div className="container-custom relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center"
          >
            <h2 className="font-display text-5xl sm:text-6xl text-white tracking-wide mb-4">
              READY TO <span className="text-accent-500">RIDE?</span>
            </h2>
            <p className="text-lg text-white/40 mb-10 max-w-md mx-auto">
              Explore our collection and find your perfect helmet today.
            </p>
            <Link href="/products">
              <button className="group inline-flex items-center gap-3 h-14 px-10 bg-accent-500 text-white font-semibold text-base rounded-xl hover:bg-accent-600 transition-all duration-300 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 hover:scale-[1.02]">
                Start Shopping
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
