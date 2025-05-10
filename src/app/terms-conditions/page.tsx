
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { StructuredData } from '@/components/structured-data';
import type { WebPage, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Wallify',
  description: 'Wallify Terms and Conditions',
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function TermsConditionsPage() {
  const today = new Date().toISOString().split('T')[0];
  const webPageSchema: WithContext<WebPage> = { 
    '@context': 'https://schema.org', 
    '@type': 'WebPage',
    name: 'Terms and Conditions - Wallify',
    url: `${BASE_URL}/terms-conditions`,
    description: 'Wallify Terms and Conditions.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/terms-conditions`,
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
              Terms & Conditions
            </h1>
          </div>
        </header>
        <main className="container mx-auto max-w-4xl p-4 py-8 md:p-6 md:py-12">
          <article className="prose prose-invert max-w-none dark:prose-invert">
            <h2 className="text-2xl font-semibold text-primary">Terms and Conditions</h2>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <p>
              Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the Wallify
              application (the "Service") operated by us.
            </p>

            <p>
              Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms.
              These Terms apply to all visitors, users, and others who wish to access or use the Service.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Use License</h3>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on Wallify's
              website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer
              of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
              <li>attempt to decompile or reverse engineer any software contained on Wallify's website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p>
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by
              Wallify at any time.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Disclaimer</h3>
            <p>
              The materials on Wallify's website are provided on an 'as is' basis. Wallify makes no warranties, expressed
              or implied, and hereby disclaims and negates all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
              intellectual property or other violation of rights.
            </p>
            <p>
              Further, Wallify does not warrant or make any representations concerning the accuracy, likely results, or
              reliability of the use of the materials on its website or otherwise relating to such materials or on any
              sites linked to this site.
            </p>

             <h3 className="text-xl font-semibold text-primary mt-6">Third-Party Content</h3>
             <p>
               Wallpapers displayed in Wallify are sourced from Pexels (<a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">https://www.pexels.com</a>) via their API.
               All images are subject to the Pexels License (<a href="https://www.pexels.com/license/" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">https://www.pexels.com/license/</a>). Wallify does not claim
               ownership of these images. Please ensure your use of downloaded wallpapers complies with the Pexels License.
             </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Limitations</h3>
            <p>
              In no event shall Wallify or its suppliers be liable for any damages (including, without limitation, damages
              for loss of data or profit, or due to business interruption) arising out of the use or inability to use the
              materials on Wallify's website, even if Wallify or a Wallify authorized representative has been notified
              orally or in writing of the possibility of such damage.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Governing Law</h3>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction, e.g., California]
              and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Changes</h3>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide
              notice of any changes by posting the new Terms and Conditions on this page.
            </p>

            <h3 className="text-xl font-semibold text-primary mt-6">Contact Us</h3>
             <p>
              If you have any questions about these Terms, please contact us via the{' '}
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
