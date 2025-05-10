
import type { MetadataRoute } from 'next';
export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: '/', changeFrequency: 'daily', priority: 1.0 },
    { url: '/explorer', changeFrequency: 'weekly', priority: 0.8 },
    { url: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { url: '/contact', changeFrequency: 'monthly', priority: 0.5 },
    { url: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
    { url: '/terms-conditions', changeFrequency: 'yearly', priority: 0.3 },
  ].map((page) => ({
    url: `${BASE_URL}${page.url.startsWith('/') ? page.url.substring(1) : page.url}`, // Ensure no double slashes if BASE_URL ends with / and page.url starts with /
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: page.priority,
  }));


  return [...staticPages]; 
}

    