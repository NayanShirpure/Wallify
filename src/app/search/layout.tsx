
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

// Metadata for the /search page (more generic as query is client-side)
export const metadata: Metadata = {
  title: 'Search Wallpapers | Wallify',
  description: 'Search and find stunning wallpapers on Wallify. High-quality backgrounds for desktop and smartphone, curated from Pexels.',
  keywords: ['wallpapers', 'search', 'backgrounds', 'Pexels', 'Wallify', 'find wallpapers'],
  alternates: {
    canonical: `${BASE_URL}search`,
  },
  openGraph: {
    title: 'Search Wallpapers | Wallify',
    description: 'Find the perfect wallpaper for your device on Wallify.',
    url: `${BASE_URL}search`,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}opengraph-image.png`, // Generic OG image
        width: 1200,
        height: 630,
        alt: 'Search Wallpapers on Wallify',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Wallpapers | Wallify',
    description: 'Find the perfect wallpaper for your device on Wallify.',
    images: [`${BASE_URL}twitter-image.png`], // Generic Twitter image
  },
};

export default function SearchLayout({
  children,
}: {
  children: ReactNode;
}) {
  // This layout wraps the search page.
  // The GlobalHeader is part of SearchPageContent or the new search/page.tsx.
  return <>{children}</>;
}
