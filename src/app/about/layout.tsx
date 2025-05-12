
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export const metadata: Metadata = {
  title: 'About Wallify - Discover Our Mission and Story',
  description: 'Learn more about Wallify, our mission to provide stunning wallpapers, and the team behind the app. We source images from Pexels to beautify your digital space.',
  keywords: ['about Wallify', 'Wallify mission', 'wallpaper app team', 'Pexels wallpapers', 'digital personalization story'],
  alternates: {
    canonical: `${BASE_URL}about`,
  },
  openGraph: {
    title: 'About Wallify - Our Story',
    description: 'Learn more about Wallify, your source for stunning wallpapers from Pexels.',
    url: `${BASE_URL}about`,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}opengraph-image.png`, 
        width: 1200,
        height: 630,
        alt: 'Wallify - About Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Wallify - Our Story',
    description: 'Learn more about Wallify and our mission to bring beautiful wallpapers to your devices.',
    images: [`${BASE_URL}twitter-image.png`], 
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
