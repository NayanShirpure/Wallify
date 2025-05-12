
import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Import Inter font
import './globals.css';
import { cn } from '@/lib/utils'; // Import cn utility
import { Toaster } from "@/components/ui/toaster"; // Import Toaster
import { ThemeProvider } from '@/components/theme-provider'; // Import ThemeProvider
import { StructuredData } from '@/components/structured-data';
import type { WithContext, WebSite, SearchAction } from 'schema-dts'; // Import SearchAction


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
  manifest: '/manifest.json', // Assuming manifest.json is in public folder
  themeColor: '#1F2937', // Dark Gray, matches dark theme background
  alternates: { // Add alternates for canonical URLs
    canonical: '/', // Sets the canonical URL for the homepage
    // you can add other alternatives here like languages or media types
    // languages: {
    //   'en-US': '/en-US',
    // },
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    images: [ // Default OpenGraph image
      {
        url: `/opengraph-image.png`, // Relative path to public folder, metadataBase will prefix it
        width: 1200,
        height: 630,
        alt: `Wallify - Stunning Wallpapers for Desktop and Smartphone`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
     images: [`/twitter-image.png`], // Relative path to public folder, metadataBase will prefix it
    site: '@NayanShirpure', // Site's Twitter handle
    creator: '@NayanShirpure', // Content creator's Twitter handle
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
  //   icon: '/favicon.ico', // Standard favicon
  //   shortcut: '/favicon-16x16.png', // For older browsers
  //   apple: '/apple-touch-icon.png', // For Apple devices
  //   // You can add more sizes or specific icons like android-chrome-192x192.png etc.
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
    potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE_URL}explorer?query={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
    } as SearchAction, 
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <StructuredData data={webSiteSchema} />
      </head>
      <body className={cn(
        inter.variable,
        'antialiased' // Removed hardcoded 'dark'
       )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
