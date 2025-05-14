
import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { StructuredData } from '@/components/structured-data';
import type { WebSite as SchemaWebSite, SearchAction as SchemaSearchAction, MinimalWithContext } from '@/types/schema-dts';
import { GlobalFooter } from '@/components/layout/GlobalFooter';


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';
const SITE_NAME = 'Wallify';
const SITE_DESCRIPTION = 'Discover and download stunning, high-quality wallpapers for your desktop and smartphone. Personalize your digital space with Wallify.';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['wallpapers', 'backgrounds', 'desktop wallpapers', 'phone wallpapers', 'HD wallpapers', '4K wallpapers', 'Pexels', 'free wallpapers', 'high quality backgrounds', 'Wallify', 'wallpaper app', 'custom backgrounds', 'device personalization'],
  manifest: '/manifest.json',
  themeColor: '#1F2937',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `/opengraph-image.png`, 
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
     images: [`/twitter-image.png`], 
    site: '@NayanShirpure', 
    creator: '@NayanShirpure',
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
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const webSiteSchema: MinimalWithContext<SchemaWebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          // Updated to use query parameter format
          urlTemplate: `${BASE_URL}search?query={search_term_string}`, 
        },
        'query-input': 'required name=search_term_string',
    } as SchemaSearchAction, 
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         <StructuredData data={webSiteSchema} />
      </head>
      <body className={cn(
        inter.className,
        'antialiased flex flex-col min-h-screen bg-background text-foreground' 
       )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-grow flex flex-col">
            {children}
          </div>
          <GlobalFooter />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
