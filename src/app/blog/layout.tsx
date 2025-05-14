
import type { Metadata } from 'next';
import { Rss } from 'lucide-react'; 
import { ThemeToggle } from '@/components/theme-toggle';
import { PageHeader } from '@/components/layout/PageHeader';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export const metadata: Metadata = {
  title: 'Wallify Blog - Trends, Tips, and Inspiration',
  description: 'Explore the Wallify blog for the latest wallpaper trends, design tips, how-to guides, and inspiration to personalize your digital space.',
  keywords: ['Wallify blog', 'wallpaper trends', 'design tips', 'wallpaper guides', 'digital art', 'desktop backgrounds', 'smartphone wallpapers', 'personalization ideas'],
  alternates: {
    canonical: '/blog',
    types: {
      'application/rss+xml': `${BASE_URL}blog/rss.xml`,
    },
  },
  openGraph: {
    title: 'Wallify Blog - Trends, Tips, and Inspiration',
    description: 'Stay updated with wallpaper trends, design insights, and personalization tips from the Wallify blog.',
    url: `${BASE_URL}blog`,
    type: 'website', 
    images: [
      {
        url: `${BASE_URL}blog/og-blog-main.png`, 
        width: 1200,
        height: 630,
        alt: 'Wallify Blog',
      },
    ],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        title="Wallify Blog"
        backHref="/"
        backTextDesktop="Back to Wallify"
        backTextMobile="Home"
      >
        <a 
          href="/blog/rss.xml" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary hover:text-accent transition-colors" 
          aria-label="RSS Feed"
        >
          <Rss className="h-5 w-5 sm:h-6 sm:w-6" />
        </a>
        <ThemeToggle />
      </PageHeader>
      <main className="flex-grow container mx-auto max-w-5xl p-4 py-8 md:p-6 md:py-12">
        {children}
      </main>
    </>
  );
}
