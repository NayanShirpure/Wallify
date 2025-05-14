
import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, Users, Target, Award, Palette, Smartphone, Monitor, Heart, Tv2 } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { StructuredData } from '@/components/structured-data';
// Updated import for local minimal types
import type { Organization, MinimalWithContext, ContactPoint } from '@/types/schema-dts';
import { ThemeToggle } from '@/components/theme-toggle';
import { PageHeader } from '@/components/layout/PageHeader';


const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function AboutUsPage() {
  // Correctly typed with MinimalWithContext<Organization>
  const orgData: MinimalWithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wallify',
    url: BASE_URL,
    logo: `${BASE_URL}opengraph-image.png`, 
    description: 'Wallify is your go-to destination for stunning, high-quality wallpapers for both mobile and desktop devices.',
    contactPoint: { 
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: `${BASE_URL}contact`,
    } as ContactPoint, 
    sameAs: [ 
        "https://x.com/NayanShirpure",
        "https://instagram.com/NayanShirpure",
        "https://github.com/NayanShirpure/Wallify"
    ]
  };

  return (
    <>
      <StructuredData data={orgData} />
      <PageHeader
        title="About Wallify"
        backHref="/"
        backTextDesktop="Back to Wallify"
        backTextMobile="Home"
      >
        <ThemeToggle />
      </PageHeader>
      <main className="flex-grow container mx-auto max-w-4xl p-4 py-8 md:p-6 md:py-12">
        <div className="space-y-10">
          <section className="text-center">
            <Image
              src="https://picsum.photos/seed/wallify-concept/300/150"
              alt="Wallify Concept Art"
              width={300}
              height={150}
              className="mx-auto mb-6 rounded-lg shadow-xl"
              data-ai-hint="app concept visual"
              priority
            />
            <h2 className="text-3xl font-bold text-primary mb-4">Welcome to Wallify</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Wallify is your go-to destination for stunning, high-quality wallpapers for both mobile and desktop devices. We believe that the right background can inspire creativity, promote calm, and reflect your personal style in the digital world.
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
                  Our mission is simple: to deliver a seamless and enjoyable experience for discovering and downloading beautiful wallpapers. Whether you’re looking for minimalism, vibrance, or breathtaking scenery — Wallify helps you personalize your device effortlessly.
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
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <span className="mr-4 text-2xl flex-shrink-0 mt-0.5" role="img" aria-label="Artist palette emoji">🎨</span>
                  <div>
                    <h3 className="font-semibold text-primary text-lg">Curated Collections</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Explore a wide range of handpicked wallpapers — from serene landscapes and abstract art to vibrant patterns and clean minimalist designs. Everything is organized into categories to make discovery effortless.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                   <span className="mr-4 text-2xl flex-shrink-0 mt-0.5" role="img" aria-label="Camera emoji">📸</span>
                  <div>
                    <h3 className="font-semibold text-primary text-lg">High-Quality Images</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      All wallpapers are sourced from Pexels, ensuring professional-grade, high-resolution content that looks stunning on any screen.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="mr-4 text-2xl flex-shrink-0 mt-0.5" role="img" aria-label="Mobile phone emoji">📱</span>
                  <div>
                    <h3 className="font-semibold text-primary text-lg">Intuitive Interface</h3>
                    <p className="text-muted-foreground leading-relaxed">
                       Designed with simplicity in mind, Wallify’s clean and modern UI makes browsing and downloading wallpapers fast and frustration-free.
                    </p>
                  </div>
                </div>
                 <div className="flex items-start">
                   <span className="mr-4 text-2xl flex-shrink-0 mt-0.5" role="img" aria-label="Desktop computer emoji">💻</span>
                  <div>
                    <h3 className="font-semibold text-primary text-lg">Optimized for All Devices</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Whether you're on a smartphone or a desktop, Wallify offers formats optimized for your screen size and resolution.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-card-foreground">
                  <Heart className="mr-3 h-7 w-7 text-accent" />
                  Meet the Creator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Wallify is developed by a passionate indie developer committed to making your digital experience more beautiful. We continuously enhance the app and welcome your feedback to help shape future updates.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-card-foreground">
                  <Tv2 className="mr-3 h-7 w-7 text-accent" /> 
                  Powered by Pexels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  All wallpapers in Wallify are provided by the Pexels API, giving you access to thousands of stunning images from talented photographers around the world.
                   Wallpapers are provided by <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">Pexels</a>.
                </p>
              </CardContent>
            </Card>
          </section>

           <section className="text-center pt-4">
            <p className="text-lg text-muted-foreground">
              Thank you for choosing Wallify — your device deserves to look this good!
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
