
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StructuredData } from '@/components/structured-data';
import type { WebPage, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'Privacy Policy - Wallify',
  description: 'Wallify Privacy Policy',
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function PrivacyPolicyPage() {
  const today = new Date().toISOString().split('T')[0];
  const webPageSchema: WithContext<WebPage> = { 
    '@context': 'https://schema.org', 
    '@type': 'WebPage',
    name: 'Privacy Policy - Wallify',
    url: `${BASE_URL}/privacy-policy`,
    description: 'Wallify Privacy Policy.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/privacy-policy`,
    },
    datePublished: today,
    dateModified: today,
  };

  return (
    <>
      <StructuredData data={webPageSchema} />
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
              Privacy Policy
            </h1>
          </div>
        </header>
        <main className="container mx-auto max-w-4xl p-4 py-8 md:p-6 md:py-12">
          <article className="prose prose-invert max-w-none dark:prose-invert">
            <h2 className="text-2xl font-semibold text-primary">Privacy Policy</h2>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <p>
              Welcome to Wallify! We are committed to protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our application.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Information We Collect</h3>
            <p>
              Wallify does not collect any personally identifiable information from its users. We use the Pexels API
              to fetch wallpapers based on your search queries and category selections. Your search terms and category
              preferences are processed to provide the service but are not stored or linked to you personally by Wallify.
            </p>
            <p>
              Usage Data: We may collect anonymous usage data through standard web analytics tools to understand how
              users interact with Wallify. This data helps us improve the application but does not identify individual users.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">How We Use Information</h3>
            <p>
              The primary use of any collected information (like search terms) is to provide and improve the Wallify service.
              Anonymous usage data helps us understand trends and enhance user experience.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Third-Party Services</h3>
            <p>
              Wallify relies on the Pexels API (<a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">https://www.pexels.com/api/</a>)
              to provide wallpaper images. Your interactions with the Pexels service through Wallify are subject to Pexels'
              own Privacy Policy (<a href="https://www.pexels.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">https://www.pexels.com/privacy-policy/</a>) and Terms of Service
              (<a href="https://www.pexels.com/terms-of-service/" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">https://www.pexels.com/terms-of-service/</a>). We recommend you review their policies.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Data Security</h3>
            <p>
              While Wallify itself does not store personal data, we implement reasonable measures to protect the application
              and its users. However, no electronic transmission or storage is 100% secure.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Changes to This Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please contact us via the{' '}
              <Link href="/contact" className="underline hover:text-accent">Contact Us</Link> page.
            </p>
          </article>
        </main>
         <footer className="mt-auto border-t border-border bg-secondary/50 py-4 text-center text-xs text-muted-foreground">
          © 2025 Wallify. All rights reserved.
        </footer>
      </div>
    </>
  );
}
