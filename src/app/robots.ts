
import type { MetadataRoute } from 'next';

// IMPORTANT: Set NEXT_PUBLIC_SITE_URL in your environment variables (e.g., .env.local or Vercel/Netlify settings)
// Example: NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wallify.example.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Add disallow rules here if needed for specific paths
        // e.g., disallow: ['/admin/', '/tmp/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    // Optionally, specify a host if your site is accessible via multiple domains
    // host: BASE_URL, 
  };
}
