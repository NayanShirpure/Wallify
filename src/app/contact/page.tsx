
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import { StructuredData } from '@/components/structured-data';
// Updated import for local minimal types
import type { ContactPage as SchemaContactPage, WebPage as SchemaWebPage, MinimalWithContext } from '@/types/schema-dts';
import { ThemeToggle } from '@/components/theme-toggle'; 
import { PageHeader } from '@/components/layout/PageHeader';


const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function ContactPage() {
  // Correctly typed with MinimalWithContext<SchemaContactPage>
  const contactPageSchema: MinimalWithContext<SchemaContactPage> = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Wallify Support and Feedback',
    url: `${BASE_URL}contact`,
    description: 'Reach out to the Wallify team for any support, feedback, or questions regarding our wallpaper application.',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}contact`,
    } as SchemaWebPage, // Cast to ensure it matches the defined WebPage type
  };
  return (
    <>
      <StructuredData data={contactPageSchema} />
      <PageHeader
        title="Contact Wallify"
        backHref="/"
        backTextDesktop="Back to Wallify"
        backTextMobile="Home"
      >
        <ThemeToggle />
      </PageHeader>
      <main className="flex flex-grow flex-col items-center justify-center p-4 py-8 md:p-6 md:py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-primary">Get in Touch</h2>
          <p className="text-muted-foreground">Have questions, feedback, or just want to say hi? Let us know!</p>
        </div>
        <ContactForm />
      </main>
    </>
  );
}
