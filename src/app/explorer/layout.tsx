
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Wallpapers - Wallify',
  description: 'Discover a vast collection of stunning, high-quality wallpapers. Explore different categories and find the perfect background for your desktop or smartphone on Wallify.',
  keywords: ['explore wallpapers', 'wallpaper gallery', 'Pexels wallpapers', 'discover backgrounds', 'new wallpapers', 'wallpaper categories', 'Wallify explorer'],
  alternates: {
    canonical: '/explorer',
  },
};

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

    
