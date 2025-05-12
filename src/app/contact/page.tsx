
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Twitter, Instagram, Github } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { StructuredData } from '@/components/structured-data';
import type { ContactPage as SchemaContactPage, WithContext } from 'schema-dts';
import { ThemeToggle } from '@/components/theme-toggle';

// Metadata is now handled by src/app/contact/layout.tsx

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function ContactPage() {
  const contactPageSchema: WithContext<SchemaContactPage> = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Wallify Support and Feedback',
    url: `${BASE_URL}contact`,
    description: 'Reach out to the Wallify team for any support, feedback, or questions regarding our wallpaper application.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}contact`,
    },
  };
  return (
    <>
      <StructuredData data={contactPageSchema} />
      <div className="min-h-screen bg-background text-foreground flex flex-col">
         <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto flex h-14 sm:h-16 items-center px-3 sm:px-4 md:px-6 relative">
            <Link href="/" className="flex items-center gap-1 sm:gap-1.5 text-sm sm:text-base font-semibold text-primary hover:text-accent transition-colors z-10" aria-label="Back to Wallify homepage">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="hidden sm:inline">
                Back
                <span className="hidden md:inline"> to Wallify</span>
              </span>
               <span className="sm:hidden">Home</span>
            </Link>
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg md:text-xl font-bold text-primary whitespace-nowrap px-2 truncate max-w-[calc(100%-120px)] sm:max-w-[calc(100%-160px)] md:max-w-[calc(100%-240px)]">
              Contact Wallify
            </h1>
            <div className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-10">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex flex-grow flex-col items-center justify-center p-4 py-8 md:p-6 md:py-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-primary">Get in Touch</h2>
            <p className="text-muted-foreground">Have questions, feedback, or just want to say hi? Let us know!</p>
          </div>
          <ContactForm />
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
                  <Link href="/blog" className="underline hover:text-accent">Blog</Link>
                  <Link href="/about" className="underline hover:text-accent">About</Link>
                  <Link href="/privacy-policy" className="underline hover:text-accent">Privacy</Link>
                  <Link href="/terms-conditions" className="underline hover:text-accent">Terms</Link> {/* Corrected link */}
              </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
