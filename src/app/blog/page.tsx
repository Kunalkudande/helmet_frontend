'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, User, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  author: string;
  tags: string[];
  category: string;
  publishedAt: string;
  views: number;
}

const CATEGORIES = ['All', 'General', 'Helmet Guide', 'Safety Tips', 'Product Review', 'Riding Tips', 'News', 'Maintenance'];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = activeCategory !== 'All' ? `?category=${encodeURIComponent(activeCategory)}` : '';
        const res = await api.get(`/blog${params}`);
        setPosts(res.data.data || []);
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchPosts();
  }, [activeCategory]);

  const estimateReadTime = (post: BlogPost) => {
    // Rough estimate based on excerpt length
    return `${Math.max(3, Math.ceil(post.excerpt.length / 50))} min read`;
  };

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
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  activeCategory === cat
                    ? 'bg-accent-500 text-white border-accent-500'
                    : 'bg-white/5 text-brand-400 border-white/10 hover:border-accent-500/30 hover:text-accent-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-brand-500 text-lg">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/blog/${post.slug}`} className="block bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden group hover:border-accent-500/20 transition">
                    <div className="aspect-video bg-gradient-to-br from-accent-500/20 to-accent-500/5 flex items-center justify-center overflow-hidden">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="text-4xl">🏍️</span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent-500/10 text-accent-400">
                          {post.category}
                        </span>
                        <span className="text-xs text-brand-500 flex items-center gap-1">
                          <Clock size={12} />
                          {estimateReadTime(post)}
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
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                              : 'Draft'}
                          </span>
                        </div>
                        <span className="text-accent-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

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
