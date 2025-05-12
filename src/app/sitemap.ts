
import type { MetadataRoute } from 'next';
import { blogPosts } from '@/config/blog'; // Import blog posts
export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: '/', changeFrequency: 'daily', priority: 1.0 },
    { url: '/explorer', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/blog', changeFrequency: 'weekly', priority: 0.9 }, // Blog index
    { url: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/terms-conditions', changeFrequency: 'yearly', priority: 0.3 },
  ].map((page) => ({
    url: `${BASE_URL}${page.url.startsWith('/') ? page.url.substring(1) : page.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: page.priority,
  }));

  const blogPostPages = blogPosts.map(post => ({
    url: `${BASE_URL}blog/${post.slug}`,
    lastModified: new Date(post.date).toISOString(), // Use post date for lastModified
    changeFrequency: 'monthly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: 0.7,
  }));


  return [...staticPages, ...blogPostPages]; 
}
