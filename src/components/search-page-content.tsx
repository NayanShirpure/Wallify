
'use client';

import type { PexelsPhoto, DeviceOrientationCategory } from '@/types/pexels';
import React, { useState, useEffect, useCallback } from 'react';
// useRouter is removed as navigation is handled by parent SearchPage or GlobalHeader callbacks
import { PreviewDialog } from '@/components/wallpaper/PreviewDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { WallpaperGrid } from '@/components/wallpaper/WallpaperGrid';
// GlobalHeader is removed from here, it's now in src/app/search/page.tsx
import { Button } from '@/components/ui/button';
import { searchPhotos as searchPhotosLib } from '@/lib/pexels';
import { StructuredData } from '@/components/structured-data';
import type { ImageObject as SchemaImageObject, Person as SchemaPerson, Organization as SchemaOrganization, MinimalWithContext } from '@/types/schema-dts';

interface SearchPageContentProps {
  initialQuery: string;
  deviceOrientation: DeviceOrientationCategory; // Receive deviceOrientation from parent
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export function SearchPageContent({ initialQuery, deviceOrientation }: SearchPageContentProps) {
  const { toast } = useToast();

  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>(initialQuery);
  // deviceOrientation is now a prop
  const [wallpapers, setWallpapers] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<PexelsPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchWallpapers = useCallback(async (query: string, category: DeviceOrientationCategory, pageNum: number = 1, append: boolean = false) => {
    setLoading(true);
    const orientationFilter = category === 'desktop' ? 'landscape' : 'portrait';
    const finalQuery = query.trim() || 'Wallpaper';

    try {
      const data = await searchPhotosLib(finalQuery, pageNum, 30, orientationFilter);
      if (data && data.photos) {
        const newPhotos = data.photos;
        setWallpapers((prev: PexelsPhoto[]): PexelsPhoto[] => {
          const combined = append ? [...prev, ...newPhotos] : newPhotos;
          // Ensure unique photos if appending, considering orientation might change what 'id' means if not careful
          const uniqueMap = new Map(combined.map((item: PexelsPhoto) => [`${item.id}-${category}`, item]));
          return Array.from(uniqueMap.values()) as PexelsPhoto[];
        });
        setHasMore(!!data.next_page && newPhotos.length > 0 && newPhotos.length === 30);
      } else {
        setWallpapers(prev => append ? prev : []);
        setHasMore(false);
        if (process.env.NODE_ENV === 'development') {
             toast({ title: "API Issue", description: "Failed to fetch wallpapers or no results. Ensure API key is valid and query is correct.", variant: "default" });
        }
      }
    } catch (error) {
      console.error("Error fetching wallpapers for search:", error);
      toast({ title: "Error", description: "Failed to fetch wallpapers. Check connection.", variant: "destructive" });
      setWallpapers(prev => append ? prev : []);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (initialQuery !== currentSearchTerm) {
        setCurrentSearchTerm(initialQuery);
    }
    setPage(1);
    setWallpapers([]);
    setHasMore(true);
    // Fetch wallpapers using the initialQuery and deviceOrientation prop
    fetchWallpapers(initialQuery, deviceOrientation, 1, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, deviceOrientation, fetchWallpapers]); // Add deviceOrientation to dependency array


  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchWallpapers(currentSearchTerm, deviceOrientation, nextPage, true);
    }
  };

  const openModal = (wallpaper: PexelsPhoto) => {
    setSelectedWallpaper(wallpaper);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedWallpaper(null), 300);
  };

  const gridAspectRatio = deviceOrientation === 'desktop' ? 'aspect-video' : 'aspect-[9/16]';

  const imageSchema: MinimalWithContext<SchemaImageObject> | null = selectedWallpaper ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: selectedWallpaper.alt || `Wallpaper by ${selectedWallpaper.photographer}`,
    description: selectedWallpaper.alt || `High-resolution wallpaper by ${selectedWallpaper.photographer}. Dimensions: ${selectedWallpaper.width}x${selectedWallpaper.height}.`,
    contentUrl: selectedWallpaper.src.original,
    thumbnailUrl: selectedWallpaper.src.medium,
    width: { '@type': 'Distance', value: selectedWallpaper.width.toString(), unitCode: 'E37' },
    height: { '@type': 'Distance', value: selectedWallpaper.height.toString(), unitCode: 'E37' },
    author: {
      '@type': 'Person',
      name: selectedWallpaper.photographer,
      url: selectedWallpaper.photographer_url,
    } as SchemaPerson,
    copyrightHolder: {
      '@type': 'Person',
      name: selectedWallpaper.photographer,
      url: selectedWallpaper.photographer_url,
    } as SchemaPerson,
    license: 'https://www.pexels.com/license/',
    acquireLicensePage: selectedWallpaper.url,
    provider: {
      '@type': 'Organization',
      name: 'Pexels',
      url: 'https://www.pexels.com',
    } as SchemaOrganization,
  } : null;

  return (
    <>
      {imageSchema && isModalOpen && <StructuredData data={imageSchema} />}
      
      {/* GlobalHeader is now rendered by the parent src/app/search/page.tsx */}

      <main className="flex-grow container mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="my-4 sm:my-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            {currentSearchTerm === "Wallpaper" ? "Search Wallpapers" : `Results for: "${currentSearchTerm}"`}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Displaying {deviceOrientation} optimized wallpapers.
          </p>
        </div>

        {loading && wallpapers.length === 0 ? (
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4`}>
            {[...Array(18)].map((_, i) => ( 
              <Skeleton key={`search-content-skeleton-${i}`} className={`${gridAspectRatio} w-full rounded-lg`} />
            ))}
          </div>
        ) : (
          <WallpaperGrid
            photos={wallpapers}
            orientation={deviceOrientation} // Pass deviceOrientation to WallpaperGrid
            onPhotoClick={openModal}
          />
        )}

        {hasMore && !loading && wallpapers.length > 0 && (
          <div className="flex justify-center mt-6 sm:mt-8 mb-4">
            <Button onClick={handleLoadMore} variant="outline" size="lg" className="text-sm px-6 py-2.5">
              Load More
            </Button>
          </div>
        )}

        {loading && wallpapers.length > 0 && (
          <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mt-4`}>
            {[...Array(6)].map((_, i) => ( 
              <Skeleton key={`search-content-loading-more-${i}`} className={`${gridAspectRatio} w-full rounded-lg`} />
            ))}
          </div>
        )}
      </main>

      <PreviewDialog
        photo={selectedWallpaper}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
