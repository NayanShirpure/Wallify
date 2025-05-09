// No 'use client' here
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
          url: `${BARE_URL}/icon.png`,
          width: 512,
          height: 512,
          alt: 'Wallify Logo',
        },
      ],
    },
  };
}

// PageProps now expects the 'params' to be a Promise
interface PageProps {
  params: Promise<{ query: string }>; // Must be a Promise
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Page({ params: paramsPromise, searchParams }: PageProps) {
  // Await the params to make sure they're resolved
  const [params, setParams] = React.useState<{ query: string } | null>(null);

  React.useEffect(() => {
    paramsPromise.then(setParams); // Resolve the promise to get the query
  }, [paramsPromise]);

  if (!params) {
    return <div>Loading...</div>; // Show a loading state until params are resolved
  }

  const query = params.query ? decodeURIComponent(params.query) : 'Wallpaper';
  const initialCategory = (searchParams?.category as Category) || 'smartphone';

  return (
    <SearchPageClient
      initialQuery={query}
      initialCategory={initialCategory}
    />
  );
}
