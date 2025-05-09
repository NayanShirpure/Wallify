// No 'use client' here as React.use can be used in Server Components
import type { Metadata } from 'next';
import { popularSearchQueries, type Category } from '@/config/categories';
import SearchPageClient from '@/components/search-page-client';
import React from 'react'; // Import React for React.use

export async function generateStaticParams() {
  // Return an array of params for popular search queries.
  const params = popularSearchQueries.map((query) => ({
    query: encodeURIComponent(query),
  }));
  return params.filter((value, index, self) =>
    index === self.findIndex((t) => t.query === value.query)
  );
}

export async function generateMetadata(
  { params, searchParams }: { params: { query: string }; searchParams?: { [key: string]: string | string[] | undefined } }
): Promise<Metadata> {
  const query = params.query ? decodeURIComponent(params.query) : 'Wallpapers';
  const category = (searchParams?.category as Category) || 'smartphone';
  const BARE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wallify.example.com';
  const pageUrl = `${BARE_URL}/search/${params.query}${searchParams?.category ? `?category=${searchParams.category}` : ''}`;

  return {
    title: `Search: ${query} (${category}) - Wallify`,
    description: `Find stunning ${category} wallpapers for "${query}" on Wallify. High-quality, free to download.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `Search: ${query} (${category}) - Wallify`,
      description: `Find stunning ${category} wallpapers for "${query}" on Wallify.`,
      url: pageUrl,
      siteName: 'Wallify',
      type: 'website',
      images: [
        {
          url: `${BARE_URL}/icon.png`, // Ensure icon.png exists in public
          width: 512,
          height: 512,
          alt: 'Wallify Logo',
        },
      ],
    },
  };
}

interface PageProps {
  params: Promise<{ query: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined } | undefined>; // Updated to Promise
}

export default function Page({ params: paramsPromise, searchParams: searchParamsPromise }: PageProps) {
  // Await the Promise to extract query value using React.use
  const resolvedParams = React.use(paramsPromise);
  const resolvedSearchParams = searchParamsPromise ? React.use(searchParamsPromise) : undefined;

  const initialQuery = resolvedParams.query ? decodeURIComponent(resolvedParams.query) : 'Wallpaper';
  const initialCategory = (resolvedSearchParams?.category as Category) || 'smartphone';

  return (
    <SearchPageClient
      initialQuery={initialQuery}
      initialCategory={initialCategory}
    />
  );
}
