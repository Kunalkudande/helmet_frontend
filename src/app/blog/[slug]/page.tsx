'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Eye, Tag, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  author: string;
  tags: string[];
  category: string;
  publishedAt: string;
  views: number;
  metaTitle: string | null;
  metaDesc: string | null;
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/blog/${slug}`);
        setPost(res.data.data);

        // Update document title for SEO
        if (res.data.data?.metaTitle || res.data.data?.title) {
          document.title = `${res.data.data.metaTitle || res.data.data.title} | Bikers Brain`;
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[hsl(0,0%,5%)] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="bg-[hsl(0,0%,5%)] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-display text-white mb-4">Post Not Found</h1>
          <p className="text-brand-500 mb-6">This blog post doesn&apos;t exist or has been removed.</p>
          <Link href="/blog" className="text-accent-400 hover:text-accent-300 font-medium">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[hsl(0,0%,5%)] min-h-screen">
      {/* Header */}
      <div className="bg-[hsl(0,0%,7%)] border-b border-white/5">
        <div className="container-custom py-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-accent-400 transition mb-6">
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-500/10 text-accent-400">
                {post.category}
              </span>
              <span className="text-xs text-brand-500 flex items-center gap-1">
                <Eye size={12} />
                {post.views.toLocaleString()} views
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display text-white mb-4 max-w-3xl">
              {post.title}
            </h1>

            <p className="text-lg text-brand-400 mb-6 max-w-2xl">{post.excerpt}</p>

            <div className="flex items-center gap-4 text-sm text-brand-500">
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Draft'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="container-custom py-8">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full max-h-[500px] object-cover rounded-2xl border border-white/10"
          />
        </div>
      )}

      {/* Content */}
      <div className="container-custom py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:text-white
              prose-p:text-brand-300 prose-p:leading-relaxed
              prose-a:text-accent-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-brand-300
              prose-ol:text-brand-300
              prose-li:marker:text-accent-500
              prose-blockquote:border-accent-500 prose-blockquote:text-brand-400
              prose-img:rounded-xl prose-img:border prose-img:border-white/10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={16} className="text-brand-500" />
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1.5 rounded-full bg-white/5 text-xs font-medium text-brand-400 hover:text-accent-400 hover:bg-accent-500/10 border border-white/10 transition"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </div>
  );
}
