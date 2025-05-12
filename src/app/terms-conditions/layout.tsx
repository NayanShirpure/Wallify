
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Wallify',
  description: 'Review the Terms and Conditions for using the Wallify application. Understand your rights and responsibilities when accessing our wallpaper service powered by Pexels.',
  keywords: ['Wallify terms and conditions', 'service agreement Wallify', 'user rights wallpaper', 'Pexels license terms', 'wallpaper usage policy', 'terms of service Wallify', 'legal Wallify'],
  alternates: {
    canonical: '/terms-conditions',
  },
};

export default function TermsConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
