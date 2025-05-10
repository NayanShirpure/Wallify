
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
const SITE_DESCRIPTION = 'Discover and download stunning, high-quality wallpapers for your desktop and smartphone. Personalize your digital space with Wallify.';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL), // Recommended for resolving openGraph.images relative paths
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['wallpapers', 'backgrounds', 'desktop wallpapers', 'phone wallpapers', 'HD wallpapers', '4K wallpapers', 'Pexels', 'free wallpapers', 'high quality backgrounds', 'Wallify', 'wallpaper app', 'custom backgrounds', 'device personalization'],
  manifest: '/manifest.json',
  themeColor: '#1F2937', // Dark Gray, matches dark theme background
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    // images are handled by opengraph-image.tsx or twitter-image.tsx conventions
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    // images are handled by opengraph-image.tsx or twitter-image.tsx conventions
    // creator: '@NayanShirpure', // Optional: Add Twitter handle if it's for the site owner
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
    potentialAction: { // Added to indicate the site's search functionality
        '@type': 'SearchAction',
        target: `${BASE_URL}/?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
    }
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
