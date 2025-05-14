
'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchPageContent } from '@/components/search-page-content';
import { StructuredData } from '@/components/structured-data';
import type { SearchResultsPage as SchemaSearchResultsPage, WebPage as SchemaWebPage, MinimalWithContext } from '@/types/schema-dts';
import { GlobalHeader } from '@/components/layout/GlobalHeader'; // Import GlobalHeader
import type { DeviceOrientationCategory } from '@/types/pexels';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';


const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

// Helper component to use useSearchParams and pass query to SearchPageContent
function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || 'Wallpaper'; // Default query

  // State for device orientation for GlobalHeader, managed here
  const [currentDeviceOrientation, setCurrentDeviceOrientation] = React.useState<DeviceOrientationCategory>('smartphone');

  const handleDeviceOrientationChange = (newCategory: DeviceOrientationCategory) => {
    if (newCategory !== currentDeviceOrientation) {
      setCurrentDeviceOrientation(newCategory);
      // The SearchPageContent's fetchWallpapers will re-run due to orientation change if it depends on it
    }
  };

  const handleWallpaperCategorySelect = (categoryValue: string) => {
    router.push(`/search?query=${encodeURIComponent(categoryValue)}`);
  };

  const handleSearchSubmit = (newSearchTerm: string) => {
    const trimmedNewSearchTerm = newSearchTerm.trim();
    if (trimmedNewSearchTerm) {
      router.push(`/search?query=${encodeURIComponent(trimmedNewSearchTerm)}`);
    }
  };

  const searchResultsSchema: MinimalWithContext<SchemaSearchResultsPage> | null = query ? {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Search results for "${query}"`,
    url: `${BASE_URL}search?query=${encodeURIComponent(query)}`,
    description: `Find stunning ${query} wallpapers on Wallify.`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}search?query=${encodeURIComponent(query)}`,
    } as SchemaWebPage,
  } : null;

  return (
    <>
      {searchResultsSchema && <StructuredData data={searchResultsSchema} />}
      <GlobalHeader
        currentDeviceOrientation={currentDeviceOrientation}
        onDeviceOrientationChange={handleDeviceOrientationChange}
        onWallpaperCategorySelect={handleWallpaperCategorySelect}
        onSearchSubmit={handleSearchSubmit}
        initialSearchTerm={query}
        navigateToSearchPage={false} // SearchBar in GlobalHeader should not re-navigate, page does
      />
      {/* Pass query and currentDeviceOrientation to SearchPageContent */}
      <SearchPageContent initialQuery={query} deviceOrientation={currentDeviceOrientation} />
    </>
  );
}

// Fallback UI for Suspense
function SearchLoadingFallback() {
  // Consistent with global loading skeleton but simpler for search context
  const gridAspectRatio = 'aspect-[9/16]'; // Default to phone for loading skeleton
  return (
    <>
    {/* Simplified GlobalHeader Skeleton - actual GlobalHeader isn't part of SearchPageContent */}
     <header className="sticky top-0 z-40 w-full border-b bg-card/90 backdrop-blur-md supports-[backdrop-filter]:bg-card/75">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-4">
            <Skeleton className="h-7 w-24" /> {/* Logo */}
            <div className="flex-1 items-center justify-end hidden sm:flex gap-1.5 sm:gap-2">
                <Skeleton className="h-9 w-32 rounded-md" /> {/* Device Tabs */}
                <Skeleton className="h-9 w-24 rounded-md" /> {/* Discover */}
                <Skeleton className="h-9 w-24 rounded-md" /> {/* Categories */}
            </div>
            <div className="w-full max-w-[150px] xs:max-w-[180px] sm:max-w-xs mx-auto sm:mx-0 sm:ml-auto">
                 <Skeleton className="h-9 w-full rounded-md" /> {/* SearchBar */}
            </div>
            <div className="sm:hidden ml-1.5">
                <Skeleton className="h-9 w-9 rounded-md" /> {/* Mobile Menu */}
            </div>
            <div className="ml-1 sm:ml-0">
                <Skeleton className="h-8 w-8 rounded-md" /> {/* Theme Toggle */}
            </div>
        </div>
     </header>
     <main className="flex-grow container mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="my-4 sm:my-6 text-center">
          <Skeleton className="h-10 w-3/4 mx-auto sm:w-1/2" /> {/* Title */}
          <Skeleton className="h-5 w-1/2 mx-auto mt-2 sm:w-1/3" /> {/* Subtitle */}
        </div>
        <div className={'grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4'}>
            {[...Array(12)].map((_, i) => (
              <Skeleton key={`search-fallback-skeleton-${i}`} className={`${gridAspectRatio} w-full rounded-lg`} />
            ))}
        </div>
      </main>
    </>
  );
}


export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoadingFallback />}>
      <SearchPageInner />
    </Suspense>
  );
}

