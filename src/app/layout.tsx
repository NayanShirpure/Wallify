import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Import Inter font
import './globals.css';
import { cn } from '@/lib/utils'; // Import cn utility
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { StructuredData } from '@/components/structured-data';
import type { WebSite } from 'schema-dts';

const inter = Inter({
  variable: '--font-inter', // Define CSS variable for Inter
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wallify',
  description: 'Beautiful wallpapers curated for you.',
  manifest: '/manifest.json', 
  themeColor: '#1F2937', 
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wallify.example.com';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSiteSchema: WebSite = {
    '@type': 'WebSite',
    name: 'Wallify',
    url: BASE_URL,
    description: 'Beautiful wallpapers curated for you.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search/{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <StructuredData data={webSiteSchema} />
      </head>
      <body className={cn(
        inter.variable, 
        'antialiased dark' 
       )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
