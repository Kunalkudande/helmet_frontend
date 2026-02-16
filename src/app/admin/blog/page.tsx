'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Eye, EyeOff, Pencil, Loader2, Save, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

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
  isPublished: boolean;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  views: number;
  createdAt: string;
}

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: 'Admin',
  tags: '',
  category: 'General',
  isPublished: false,
  metaTitle: '',
  metaDesc: '',
};

const CATEGORIES = ['General', 'Helmet Guide', 'Safety Tips', 'Product Review', 'Riding Tips', 'News', 'Maintenance'];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/blog/admin/all');
      setPosts(res.data.data || []);
    } catch {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowEditor(true);
  };

  const openEdit = async (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || '',
      author: post.author,
      tags: post.tags.join(', '),
      category: post.category,
      isPublished: post.isPublished,
      metaTitle: post.metaTitle || '',
      metaDesc: post.metaDesc || '',
    });
    setShowEditor(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      toast.error('Title, excerpt and content are required');
      return;
    }

    const payload = {
      ...form,
      slug: form.slug || generateSlug(form.title),
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/blog/admin/${editingId}`, payload);
        toast.success('Post updated!');
      } else {
        await api.post('/blog/admin', payload);
        toast.success('Post created!');
      }
      setShowEditor(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blog/admin/${id}`);
      toast.success('Post deleted');
      fetchPosts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 placeholder:text-brand-500 hover:border-white/20';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display text-white">{editingId ? 'Edit Post' : 'New Blog Post'}</h1>
          <Button variant="ghost" onClick={() => setShowEditor(false)} leftIcon={<X size={16} />}>
            Cancel
          </Button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      title: e.target.value,
                      slug: editingId ? form.slug : generateSlug(e.target.value),
                    });
                  }}
                  placeholder="Blog post title"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-300 mb-1.5">Excerpt *</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="A short summary shown in blog listing..."
                rows={2}
                className={cn(inputClass, 'resize-vertical')}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-300 mb-1.5">Content * (HTML supported)</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Full blog post content. HTML tags are supported for formatting."
                rows={12}
                className={cn(inputClass, 'resize-vertical font-mono text-xs')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Cover Image URL</label>
                <input
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Author</label>
                <input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className={cn(inputClass, 'bg-white/5')}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-300 mb-1.5">Tags (comma-separated)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g. safety, full-face, ISI"
                  className={inputClass}
                />
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-4 h-4 text-accent-500 rounded"
                  />
                  <span className="text-sm text-brand-300 font-semibold">Publish immediately</span>
                </label>
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-white">SEO Settings</h2>
            <div>
              <label className="block text-sm font-semibold text-brand-300 mb-1.5">Meta Title</label>
              <input
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                placeholder="Defaults to post title"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-brand-300 mb-1.5">Meta Description</label>
              <textarea
                value={form.metaDesc}
                onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
                placeholder="Defaults to excerpt"
                rows={2}
                className={cn(inputClass, 'resize-vertical')}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowEditor(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={saving} leftIcon={<Save size={16} />}>
              {editingId ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-white">Blog Posts</h1>
          <p className="text-sm text-brand-500 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openNew} leftIcon={<Plus size={16} />}>
          New Post
        </Button>
      </div>

      {/* Posts Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto text-brand-600 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No blog posts yet</h3>
            <p className="text-sm text-brand-500 mb-6">Start writing to improve your SEO and engage riders</p>
            <Button onClick={openNew} leftIcon={<Plus size={16} />}>
              Write First Post
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-6 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider">Post</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider hidden lg:table-cell">Views</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-xs font-semibold text-brand-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <ImageIcon size={18} className="text-brand-500" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-white text-sm">{post.title}</h3>
                          <p className="text-xs text-brand-500 mt-0.5 line-clamp-1">{post.excerpt}</p>
                          <p className="text-xs text-brand-600 mt-0.5">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-white/5 text-xs font-semibold text-brand-300">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-sm text-brand-300">{post.views.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      {post.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold">
                          <Eye size={12} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-semibold">
                          <EyeOff size={12} /> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(post)}
                          className="p-2 rounded-lg hover:bg-white/5 text-brand-400 hover:text-white transition"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-brand-400 hover:text-red-400 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
