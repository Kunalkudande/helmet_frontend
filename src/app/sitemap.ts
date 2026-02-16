import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchJSON(url: string) {
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // revalidate every hour
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/policies/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/policies/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/policies/shipping`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/policies/returns`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Category pages
  const categories = ['FULL_FACE', 'HALF_FACE', 'OPEN_FACE', 'MODULAR', 'OFF_ROAD', 'KIDS', 'LADIES'];
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/products?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Product pages
  let productPages: MetadataRoute.Sitemap = [];
  const productsData = await fetchJSON(`${API_URL}/products?limit=1000`);
  if (productsData?.data?.products) {
    productPages = productsData.data.products.map((p: { slug: string; updatedAt: string }) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  }

  // Blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  const blogData = await fetchJSON(`${API_URL}/blog?limit=1000`);
  if (blogData?.data?.posts) {
    blogPages = blogData.data.posts.map((post: { slug: string; updatedAt: string }) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  }

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages];
}
