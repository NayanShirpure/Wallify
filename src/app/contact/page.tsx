
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ContactForm } from '@/components/contact-form'; // Import the client component

export const metadata: Metadata = {
  title: 'Contact Us - Wallify',
  description: 'Contact Wallify support',
};


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col">
       <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-14 sm:h-16 items-center px-3 sm:px-4 md:px-6 relative">
          <Link href="/" className="flex items-center gap-1 sm:gap-1.5 text-sm sm:text-base font-semibold text-primary hover:text-accent transition-colors z-10" aria-label="Back to Wallify homepage">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="hidden sm:inline">
              Back
              <span className="hidden md:inline"> to Wallify</span>
            </span>
          </Link>
          <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg md:text-xl font-bold text-primary whitespace-nowrap px-2 truncate max-w-[calc(100%-80px)] sm:max-w-[calc(100%-120px)] md:max-w-[calc(100%-200px)]">
            Contact Us
          </h1>
        </div>
      </header>
      <main className="flex flex-grow flex-col items-center justify-center p-4 py-8 md:p-6 md:py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-primary">Get in Touch</h2>
          <p className="text-muted-foreground">Have questions or feedback? Let us know!</p>
        </div>
        {/* Render the client component */}
        <ContactForm />
      </main>
       <footer className="mt-auto border-t border-border bg-secondary/50 py-4 text-center text-xs text-muted-foreground">
         © {new Date().getFullYear()} Wallify. All rights reserved.
      </footer>
    </div>
  );
}
