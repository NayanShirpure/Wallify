
'use client'; 

import React, { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { StructuredData } from '@/components/structured-data';
// Updated import for local minimal types
import type { WebPage as SchemaWebPage, MinimalWithContext } from '@/types/schema-dts';
import { ThemeToggle } from '@/components/theme-toggle'; 
import { PageHeader } from '@/components/layout/PageHeader';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function TermsConditionsPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    setLastUpdatedDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  const actualTermsModificationDate = "2024-07-22"; // Updated to reflect new content change date

  // Correctly typed with MinimalWithContext<SchemaWebPage>
  const webPageSchema: MinimalWithContext<SchemaWebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage', 
    name: 'Terms and Conditions for Wallify Application',
    url: `${BASE_URL}terms-conditions`,
    description: 'Official Terms and Conditions governing the use of the Wallify wallpaper application.',
    mainEntityOfPage: { 
      '@type': 'WebPage',
      '@id': `${BASE_URL}terms-conditions`,
    } as SchemaWebPage, 
    datePublished: "2024-01-01", 
    dateModified: actualTermsModificationDate, 
  };

  return (
    <>
      <StructuredData data={webPageSchema} />
      <PageHeader
        title="Terms & Conditions"
        backHref="/"
        backTextDesktop="Back to Wallify"
        backTextMobile="Home"
      >
        <ThemeToggle />
      </PageHeader>
      <main className="flex-grow container mx-auto max-w-4xl p-4 py-8 md:p-6 md:py-12">
        <article className="prose prose-invert max-w-none dark:prose-invert prose-headings:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          <h2 className="text-2xl font-semibold text-primary">Terms and Conditions for Wallify</h2>
          <p>Last updated: {lastUpdatedDate || 'Loading date...'}</p>

          <p>
            Welcome to Wallify! Please read these Terms and Conditions ("Terms") carefully before using the Wallify application (the "Service") operated by us.
          </p>

          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Use License</h3>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to access and use Wallify for personal, non-commercial purposes. Under this license, you may not:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Modify, copy, or redistribute the materials;</li>
            <li>Use the materials for any commercial or public display;</li>
            <li>Attempt to decompile or reverse engineer any software provided by Wallify;</li>
            <li>Remove any copyright or proprietary notations;</li>
            <li>Mirror or host the materials on another server.</li>
          </ul>
          <p>
            This license automatically terminates if you violate these restrictions and may be terminated by Wallify at any time.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Disclaimer</h3>
          <p>
            Wallify provides the Service and all content on an "as is" and "as available" basis. We make no warranties, expressed or implied, including but not limited to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Warranties of merchantability;</li>
            <li>Fitness for a particular purpose;</li>
            <li>Non-infringement.</li>
          </ul>
          <p>
             We do not guarantee the accuracy, reliability, or availability of the Service or any linked content.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Third-Party Content</h3>
           <p>
             Wallpapers displayed in Wallify are sourced from Pexels (<a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</a>) via their API.
             All images are subject to the Pexels License (<a href="https://www.pexels.com/license/" target="_blank" rel="noopener noreferrer">Pexels License</a>). Wallify does not claim
             ownership of these images. Users are responsible for ensuring their use of downloaded wallpapers complies with the Pexels License.
           </p>


          <h3 className="text-xl font-semibold text-primary mt-6">Limitations of Liability</h3>
          <p>
            In no event shall Wallify or its suppliers be liable for any damages (including, without limitation, loss of data or profits, or business interruption) arising out of the use or inability to use the Service, even if we have been advised of the possibility of such damages.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of Maharashtra, India, and you agree to submit to the exclusive jurisdiction of the courts located there.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Changes</h3>
          <p>
            We reserve the right to update or modify these Terms at our sole discretion. Any changes will be posted on this page with the updated date. Continued use of the Service after such changes constitutes your acceptance of the new Terms.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Contact Us</h3>
           <p>
            If you have any questions about these Terms, please <Link href="/contact">contact us</Link>.
          </p>

        </article>
      </main>
    </>
  );
}

