
'use client'; 

import React, { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { StructuredData } from '@/components/structured-data';
import type { WebPage as SchemaWebPage, MinimalWithContext } from '@/types/schema-dts';
import { ThemeToggle } from '@/components/theme-toggle'; 
import { PageHeader } from '@/components/layout/PageHeader';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function PrivacyPolicyPage() {
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string | null>(null);

  useEffect(() => {
    // This will set the "Last updated" to the current date when the page is viewed.
    // If you want a static "Last updated" date, replace this with a fixed string.
    setLastUpdatedDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);
  
  // This should be the actual date the policy content was last substantively modified.
  const actualPolicyModificationDate = "2024-07-20"; // Update this if policy text changes significantly

  const webPageSchema: MinimalWithContext<SchemaWebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage', 
    name: 'Privacy Policy for Wallify Wallpaper Application',
    url: `${BASE_URL}privacy-policy`,
    description: 'Official Privacy Policy for the Wallify application, detailing data handling practices.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}privacy-policy`,
    } as SchemaWebPage,
    datePublished: "2024-01-01", 
    dateModified: actualPolicyModificationDate, 
  };

  return (
    <>
      <StructuredData data={webPageSchema} />
      <PageHeader
        title="Privacy Policy"
        backHref="/"
        backTextDesktop="Back to Wallify"
        backTextMobile="Home"
      >
        <ThemeToggle />
      </PageHeader>
      <main className="flex-grow container mx-auto max-w-4xl p-4 py-8 md:p-6 md:py-12">
        <article className="prose prose-invert max-w-none dark:prose-invert prose-headings:text-primary prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          <h2 className="text-2xl font-semibold text-primary">Privacy Policy for Wallify</h2>
          <p>Last updated: {lastUpdatedDate || 'Loading date...'}</p>

          <p>
            Welcome to Wallify! Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our application ("Wallify", "we", "our", or "us").
          </p>
          <p>
            By using Wallify, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Information We Collect</h3>
          <p>
            Wallify does not collect any personally identifiable information (PII) from its users.
          </p>
          
          <h4 className="text-lg font-semibold text-primary mt-4">a. Search and Category Data</h4>
          <p>
            We use the Pexels API to fetch wallpapers based on your search terms and category selections. These inputs are processed in real-time to provide results but are not stored or linked to you personally.
          </p>

          <h4 className="text-lg font-semibold text-primary mt-4">b. Anonymous Usage Data</h4>
          <p>
            We may collect non-personal, anonymous data (such as page views, device type, and usage trends) using standard web analytics tools. This data helps us improve performance and user experience but does not identify individual users.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">How We Use Information</h3>
          <p>
            The limited information we collect is used solely to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Deliver and improve the wallpaper search functionality;</li>
            <li>Understand general usage patterns;</li>
            <li>Enhance the overall user experience.</li>
          </ul>
          <p>
            No personally identifiable information is collected, stored, or sold.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Third-Party Services</h3>
          <p>
            Wallify uses the Pexels API (<a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer">https://www.pexels.com/api/</a>) to display wallpapers. Your interactions with Pexels content are subject to Pexels' Privacy Policy (<a href="https://www.pexels.com/privacy-policy/" target="_blank" rel="noopener noreferrer">https://www.pexels.com/privacy-policy/</a>) and Terms of Service (<a href="https://www.pexels.com/terms-of-service/" target="_blank" rel="noopener noreferrer">https://www.pexels.com/terms-of-service/</a>). We encourage you to review those policies.
          </p>
          {/* Note: Formspree mention removed as per the new text. If contact form still uses it, it should be added back. */}

          <h3 className="text-xl font-semibold text-primary mt-6">Data Security</h3>
          <p>
            Although Wallify does not store personal information, we implement reasonable technical and organizational measures to protect the application from unauthorized access or misuse. However, no method of transmission or storage on the internet is 100% secure.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Children’s Privacy</h3>
          <p>
              Wallify is not intended for use by children under the age of 13. We do not knowingly collect personal data from children. If we become aware that we have inadvertently received such information, we will take steps to delete it.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Changes to This Privacy Policy</h3>
          <p>
            We may update this Privacy Policy periodically. Any changes will be posted on this page with the updated effective date. We encourage you to review this page regularly for any updates.
          </p>

          <h3 className="text-xl font-semibold text-primary mt-6">Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please <Link href="/contact">contact us</Link>.
          </p>
        </article>
      </main>
    </>
  );
}
