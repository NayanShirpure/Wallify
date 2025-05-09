
import type { MetadataRoute } from 'next';
import type { Category } from '@/types/pexels';

// IMPORTANT: Set NEXT_PUBLIC_SITE_URL in your environment variables (e.g., .env.local or Vercel/Netlify settings)
// Example: NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wallify.example.com';

const popularSearchQueries = [
  'Wallpaper',
  'Nature',
  'Technology',
  'Abstract',
  'Minimalist',
  'Space',
  'Animals',
  'City',
  'Food',
  'Travel',
  'Dark',
  'Pattern',
  'Office',
  'Sky',
  'Vintage',
];

const deviceCategories: Category[] = ['smartphone', 'desktop'];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: '/', changeFrequency: 'daily', priority: 1.0 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/terms-conditions', changeFrequency: 'yearly', priority: 0.3 },
  ].map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: page.priority,
  }));

  const searchCategoryPages = popularSearchQueries.flatMap((query) =>
    deviceCategories.map((deviceCategory) => ({
      url: `${BASE_URL}/search/${encodeURIComponent(query)}?category=${deviceCategory}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as MetadataRoute.Sitemap[0]['changeFrequency'],
      priority: 0.6,
    }))
  );

  return [...staticPages, ...searchCategoryPages];
}
