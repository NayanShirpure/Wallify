
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export const metadata: Metadata = {
  title: 'Discover Wallpapers - Featured Collections & Trends | Wallify',
  description: 'Explore curated collections, trending wallpapers, and new additions on Wallify. Discover stunning backgrounds for your desktop and smartphone.',
  keywords: ['discover wallpapers', 'featured wallpapers', 'trending backgrounds', 'wallpaper collections', 'new wallpapers', 'Wallify discover'],
  alternates: {
    canonical: `${BASE_URL}discover`,
  },
  openGraph: {
    title: 'Discover Wallpapers on Wallify',
    description: 'Explore curated collections and trending wallpapers for all your devices.',
    url: `${BASE_URL}discover`,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}opengraph-image.png`, // Using generic OG image
        width: 1200,
        height: 630,
        alt: 'Wallify - Discover Wallpapers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Wallpapers on Wallify',
    description: 'Explore curated collections and trending wallpapers.',
    images: [`${BASE_URL}twitter-image.png`], // Using generic Twitter image
  },
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The page (discover/page.tsx) will now include GlobalHeader and its own <main> tag
  // for consistency with home.tsx and search/[query]/page.tsx.
  // This layout component is now primarily for applying metadata.
  return <>{children}</>;
}
