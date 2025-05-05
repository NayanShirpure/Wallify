
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
       <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
            <ArrowLeft className="h-5 w-5" />
            Back to Wallify
          </Link>
          <h1 className="text-xl font-bold text-primary">Contact Us</h1>
           <div className="w-10"></div> {/* Spacer */}
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
