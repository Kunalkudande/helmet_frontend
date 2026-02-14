'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Clock, User } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'How to Choose the Right Helmet Size',
    excerpt: 'A comprehensive guide to measuring your head and finding the perfect helmet fit for maximum safety and comfort.',
    category: 'Buying Guide',
    author: 'Rajesh Kumar',
    date: '2024-01-15',
    readTime: '5 min read',
    image: null,
  },
  {
    id: 2,
    title: 'ISI vs DOT vs ECE: Understanding Helmet Certifications',
    excerpt: 'Learn the differences between major helmet safety certifications and why they matter for your protection.',
    category: 'Safety',
    author: 'Amit Patel',
    date: '2024-01-10',
    readTime: '7 min read',
    image: null,
  },
  {
    id: 3,
    title: 'Top 10 Helmets for Indian Roads in 2024',
    excerpt: 'Our expert picks for the best helmets available in India, considering safety, comfort, and value for money.',
    category: 'Reviews',
    author: 'Priya Sharma',
    date: '2024-01-05',
    readTime: '8 min read',
    image: null,
  },
  {
    id: 4,
    title: 'Helmet Maintenance: Tips to Make Your Helmet Last',
    excerpt: 'Simple care tips to keep your helmet clean, fresh, and in top condition for years of safe riding.',
    category: 'Tips',
    author: 'Rajesh Kumar',
    date: '2023-12-28',
    readTime: '4 min read',
    image: null,
  },
  {
    id: 5,
    title: 'Full Face vs Modular vs Open Face: Which is Best?',
    excerpt: 'Comparing different helmet types to help you decide which style suits your riding needs.',
    category: 'Buying Guide',
    author: 'Amit Patel',
    date: '2023-12-20',
    readTime: '6 min read',
    image: null,
  },
  {
    id: 6,
    title: 'When Should You Replace Your Helmet?',
    excerpt: 'Know the signs that indicate it\'s time for a new helmet, even if it looks fine on the outside.',
    category: 'Safety',
    author: 'Priya Sharma',
    date: '2023-12-15',
    readTime: '3 min read',
    image: null,
  },
];

const categories = ['All', 'Buying Guide', 'Safety', 'Reviews', 'Tips'];

export default function BlogPage() {
  return (
    <div className="bg-[hsl(0,0%,5%)]">
      {/* Hero */}
      <section className="bg-[hsl(0,0%,7%)] border-b border-white/5 text-white py-16">
        <div className="container-custom text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display mb-3"
          >
            Helmet Blog
          </motion.h1>
          <p className="text-brand-400 max-w-lg mx-auto">
            Tips, guides, and insights to help you ride safer and make informed helmet choices.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-brand-400 border border-white/10 hover:border-accent-500/30 hover:text-accent-400 transition first:bg-accent-500 first:text-white first:border-accent-500"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden group hover:border-accent-500/20 transition"
              >
                <div className="aspect-video bg-gradient-to-br from-accent-500/20 to-accent-500/5 flex items-center justify-center">
                  <span className="text-4xl">🏍️</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent-500/10 text-accent-400">
                      {post.category}
                    </span>
                    <span className="text-xs text-brand-500 flex items-center gap-1">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2 group-hover:text-accent-400 transition line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-brand-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-brand-500">
                      <User size={12} />
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <span className="text-accent-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 bg-[hsl(0,0%,7%)] rounded-3xl p-8 md:p-12 text-center text-white border border-white/10">
            <h2 className="text-2xl font-display mb-2">Stay Updated</h2>
            <p className="text-brand-400 mb-6 max-w-md mx-auto">
              Subscribe to our newsletter for the latest blog posts, deals, and riding tips.
            </p>
            <div className="flex max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-brand-500 focus:outline-none focus:border-accent-400"
              />
              <button className="px-6 py-3 bg-accent-500 text-white rounded-xl font-medium hover:bg-accent-600 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
