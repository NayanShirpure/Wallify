
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Import Inter font
import './globals.css';
import { cn } from '@/lib/utils'; // Import cn utility
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { StructuredData } from '@/components/structured-data';
import type { WithContext, WebSite } from 'schema-dts';


const inter = Inter({
  variable: '--font-inter', // Define CSS variable for Inter
  subsets: ['latin'],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';
const SITE_NAME = 'Wallify';
const SITE_DESCRIPTION = 'Beautiful wallpapers curated for you.';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL), // Recommended for resolving openGraph.images relative paths
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  themeColor: '#1F2937', // Dark Gray, matches dark theme background
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    // Images array removed to allow Next.js to automatically pick up
    // src/app/opengraph-image.(jpg|png|tsx) if it exists.
    // images: [
    //   {
    //     url: '/opengraph-image.png', // Path relative to the public folder
    //     width: 1200,
    //     height: 630,
    //     alt: `${SITE_NAME} - ${SITE_DESCRIPTION}`,
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    // Images array removed to allow Next.js to automatically pick up
    // src/app/twitter-image.(jpg|png|tsx) or fallback to OpenGraph image.
    // images: [`${BASE_URL}/opengraph-image.png`], // Must be an absolute URL
    // creator: '@yourtwitterhandle', // Optional: Add Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // icons: { // Add icons if you have them in public folder
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon-16x16.png',
  //   apple: '/apple-touch-icon.png',
  // },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSiteSchema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
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
