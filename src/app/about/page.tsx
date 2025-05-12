
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Info, Users, Target, Twitter, Instagram, Github } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { StructuredData } from '@/components/structured-data';
import type { Organization, WithContext } from 'schema-dts';
import { ThemeToggle } from '@/components/theme-toggle';

// Metadata is now handled by src/app/about/layout.tsx

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function AboutUsPage() {
  const orgData: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wallify',
    url: BASE_URL,
    logo: `${BASE_URL}opengraph-image.png`, 
    description: 'Wallify is your ultimate destination for stunning, high-quality wallpapers for all your devices, sourced from Pexels.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: `${BASE_URL}contact`,
    },
    sameAs: [ 
        "https://x.com/NayanShirpure",
        "https://instagram.com/NayanShirpure",
        "https://github.com/NayanShirpure/Wallify"
    ]
  };

  return (
    <>
      <StructuredData data={orgData} />
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto flex h-14 sm:h-16 items-center px-3 sm:px-4 md:px-6 relative">
            <Link href="/" className="flex items-center gap-1 sm:gap-1.5 text-sm sm:text-base font-semibold text-primary hover:text-accent transition-colors z-10" aria-label="Back to Wallify homepage">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="hidden sm:inline">
                Back
                <span className="hidden md:inline"> to Wallify</span>
              </span>
               <span className="sm:hidden">Home</span>
            </Link>
            <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg md:text-xl font-bold text-primary whitespace-nowrap px-2 truncate max-w-[calc(100%-120px)] sm:max-w-[calc(100%-160px)] md:max-w-[calc(100%-240px)]">
              About Wallify
            </h1>
            <div className="absolute right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-10">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto max-w-4xl p-4 py-8 md:p-6 md:py-12">
          <div className="space-y-12">
            <section className="text-center">
              <Image
                src="https://picsum.photos/seed/wallify-brand-visual/300/150"
                alt="Wallify Brand Visual"
                width={300}
                height={150}
                className="mx-auto mb-6 rounded-lg shadow-lg"
                data-ai-hint="app brand concept"
                priority
              />
              <h2 className="text-3xl font-bold text-primary mb-4">Welcome to Wallify</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Wallify is your ultimate destination for stunning, high-quality wallpapers for all your devices.
                We believe that a beautiful background can inspire creativity, bring tranquility, and personalize
                your digital space.
              </p>
            </section>

            <section>
              <Card className="bg-card border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-card-foreground">
                    <Target className="mr-3 h-7 w-7 text-accent" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Our mission is simple: to provide a seamless and enjoyable experience for discovering and
                    downloading beautiful wallpapers. We curate a vast collection of images from Pexels, ensuring there's
                    something for every taste and style, for both your smartphone and desktop.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="bg-card border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-card-foreground">
                    <Info className="mr-3 h-7 w-7 text-accent" />
                    What We Offer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-primary text-lg">Curated Collections</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Access a diverse range of wallpapers, from breathtaking landscapes and abstract art to
                      minimalist designs and vibrant patterns, all easily searchable and categorized.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-lg">High Quality Images</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      All wallpapers are sourced from Pexels, ensuring high resolution and stunning clarity for
                      your devices.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-lg">User-Friendly Interface</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our app is designed to be intuitive and easy to navigate, making it effortless to find and
                      download your next favorite wallpaper.
                    </p>
                  </div>
                   <div>
                    <h3 className="font-semibold text-primary text-lg">Optimized for All Devices</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Easily switch between smartphone (portrait) and desktop (landscape) optimized wallpapers to find the perfect fit.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card className="bg-card border-border shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-card-foreground">
                    <Users className="mr-3 h-7 w-7 text-accent" />
                    The Team
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Wallify was created by a passionate developer dedicated to bringing beauty and personalization
                    to your digital experience. We are constantly working to improve the app and add new features.
                    Your feedback is always welcome!
                  </p>
                </CardContent>
              </Card>
            </section>

             <section className="text-center">
              <p className="text-muted-foreground">
                Thank you for choosing Wallify. We hope you enjoy our collection!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Wallpapers are provided by <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">Pexels</a>.
              </p>
            </section>
          </div>
        </main>
        <footer className="text-center text-muted-foreground text-xs mt-auto py-3 sm:py-4 border-t border-border bg-background/50">
           <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 px-4">
              <p className="text-center md:text-left">
                  © {new Date().getFullYear()} Wallify. All rights reserved.
              </p>
              <div className="flex items-center gap-x-3 sm:gap-x-4">
                <a href="https://x.com/NayanShirpure" target="_blank" rel="noopener noreferrer" aria-label="Wallify on Twitter" className="text-muted-foreground hover:text-accent transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://instagram.com/NayanShirpure" target="_blank" rel="noopener noreferrer" aria-label="Wallify on Instagram" className="text-muted-foreground hover:text-accent transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://github.com/NayanShirpure/Wallify" target="_blank" rel="noopener noreferrer" aria-label="Wallify on GitHub" className="text-muted-foreground hover:text-accent transition-colors">
                  <Github className="h-4 w-4" />
                </a>
              </div>
              <nav className="flex gap-x-3 sm:gap-x-4 gap-y-1 flex-wrap justify-center md:justify-end">
                  <Link href="/" className="underline hover:text-accent">Home</Link>
                  <Link href="/explorer" className="underline hover:text-accent">Explore</Link>
                  <Link href="/blog" className="underline hover:text-accent">Blog</Link>
                  <Link href="/privacy-policy" className="underline hover:text-accent">Privacy</Link>
                  <Link href="/terms-conditions" className="underline hover:text-accent">Terms</Link>
                  <Link href="/contact" className="underline hover:text-accent">Contact</Link>
              </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
