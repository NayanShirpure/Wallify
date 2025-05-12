
import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export const metadata: Metadata = {
  title: 'Contact Wallify - Support, Feedback, and Inquiries',
  description: 'Get in touch with the Wallify team. Whether you have questions, feedback, or need support, use our contact form to reach us.',
  keywords: ['contact Wallify', 'Wallify support', 'wallpaper app feedback', 'customer service Wallify', 'reach Wallify team'],
  alternates: {
    canonical: `${BASE_URL}contact`,
  },
  openGraph: {
    title: 'Contact Wallify - Get In Touch',
    description: 'Reach out to Wallify for support, feedback, or any inquiries.',
    url: `${BASE_URL}contact`,
    type: 'website',
    images: [
      {
        url: `${BASE_URL}opengraph-image.png`, 
        width: 1200,
        height: 630,
        alt: 'Wallify - Contact Us',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Wallify - Get In Touch',
    description: 'Have questions or feedback for Wallify? Contact us here.',
    images: [`${BASE_URL}twitter-image.png`],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
