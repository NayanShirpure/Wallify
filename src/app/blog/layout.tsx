
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Rss, Twitter, Instagram, Github } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

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
    type: 'website', // or 'blog' if more appropriate
    images: [
      {
        url: `${BASE_URL}blog/og-blog-main.png`, // Default OG for blog section
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
          <Link href="/" className="flex items-center gap-1 sm:gap-1.5 text-sm sm:text-base font-semibold text-primary hover:text-accent transition-colors z-10" aria-label="Back to Wallify homepage">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="hidden sm:inline">
              Back to Wallify
            </span>
             <span className="sm:hidden">Home</span>
          </Link>
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary whitespace-nowrap px-2">
            Wallify Blog
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <a href="/blog/rss.xml" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-accent transition-colors" aria-label="RSS Feed">
              <Rss className="h-5 w-5 sm:h-6 sm:w-6" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto max-w-5xl p-4 py-8 md:p-6 md:py-12">
        {children}
      </main>
      <footer className="text-center text-muted-foreground text-xs mt-auto py-3 sm:py-4 border-t border-border bg-background/50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 px-4">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Wallify. All rights reserved.
          </p>
          <div className="flex items-center gap-x-3 sm:gap-x-4">
            <a href="https://x.com/NayanShirpure" target="_blank" rel="noopener noreferrer" aria-label="Wallify on Twitter" className="text-muted-foreground hover:text-accent transition-colors">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://instagram.com/NayanShirpure" target="_blank" rel="noopener noreferrer" aria-label="Wallify on Instagram" className="text-muted-foreground hover:text-accent transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://github.com/NayanShirpure/Wallify" target="_blank" rel="noopener noreferrer" aria-label="Wallify on GitHub" className="text-muted-foreground hover:text-accent transition-colors">
              <Github className="h-4 w-4" />
            </a>
          </div>
          <nav className="flex gap-x-3 sm:gap-x-4 gap-y-1 flex-wrap justify-center md:justify-end">
            <Link href="/" className="underline hover:text-accent">Home</Link>
            <Link href="/explorer" className="underline hover:text-accent">Explore</Link>
            <Link href="/about" className="underline hover:text-accent">About</Link>
            <Link href="/contact" className="underline hover:text-accent">Contact</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
