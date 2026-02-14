'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CATEGORIES } from '@/lib/constants';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[hsl(0,0%,5%)]">
      {/* Hero */}
      <div className="bg-[hsl(0,0%,7%)] border-b border-white/5 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl font-display mb-4">Helmet Categories</h1>
          <p className="text-lg text-brand-400 max-w-xl mx-auto">
            Find the perfect helmet for every ride. From full-face protection to open-face freedom.
          </p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.value}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/products?category=${cat.value}`}
                className="group block bg-white/[0.03] rounded-2xl overflow-hidden border border-white/10 hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 bg-gradient-to-br from-secondary-700 to-secondary-800 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                    <h2 className="text-2xl font-bold text-white">{cat.label}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-brand-400 mb-4">{cat.description}</p>
                  <span className="text-accent-500 font-semibold text-sm group-hover:translate-x-1 inline-block transition-transform">
                    Shop {cat.label} Helmets →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
