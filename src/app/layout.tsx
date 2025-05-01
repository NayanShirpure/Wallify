import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Import Inter font
import './globals.css';
import { cn } from '@/lib/utils'; // Import cn utility
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({
  variable: '--font-inter', // Define CSS variable for Inter
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wallify',
  description: 'Beautiful wallpapers curated for you.',
  // Add PWA related meta tags for better Android integration if needed later
  manifest: '/manifest.json', // Example, create manifest later if needed
  themeColor: '#1F2937', // Set theme color for browser UI
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Apply dark theme by default and Inter font */}
      <body className={cn(
        inter.variable, // Use Inter font variable
        'antialiased dark' // Apply dark theme globally
       )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
