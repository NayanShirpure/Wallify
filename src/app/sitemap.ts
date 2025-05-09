
import type { MetadataRoute } from 'next';
// Removed: import { popularSearchQueries, deviceCategories, type Category } from '@/config/categories';
export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wallify.example.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: '/', changeFrequency: 'daily', priority: 1.0 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/terms-conditions', changeFrequency: 'yearly', priority: 0.3 },
  ].map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: page.priority,
  }));

  // Removed searchCategoryPages as the search page is deleted
  // const searchCategoryPages = popularSearchQueries.flatMap((query) =>
  //   deviceCategories.map((deviceCategory) => ({
  //     url: `${BASE_URL}/search/${encodeURIComponent(query)}?category=${deviceCategory}`,
  //     lastModified: new Date().toISOString(),
  //     changeFrequency: 'weekly' as MetadataRoute.Sitemap[0]['changeFrequency'],
  //     priority: 0.6,
  //   }))
  // );

  return [...staticPages]; // Return only static pages
}

