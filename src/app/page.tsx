
'use client';

import type { PexelsPhoto, DeviceOrientationCategory } from '@/types/pexels';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Added useRouter
import { PreviewDialog } from '@/components/wallpaper/PreviewDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { StructuredData } from '@/components/structured-data';
import type { ImageObject as SchemaImageObject, MinimalWithContext, Person as SchemaPerson, Organization as SchemaOrganization } from '@/types/schema-dts';
import { WallpaperGrid } from '@/components/wallpaper/WallpaperGrid';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { Button } from '@/components/ui/button';
import { searchPhotos as searchPhotosLib } from '@/lib/pexels';


export default function Home() {
  const router = useRouter(); // Initialize useRouter
  const [searchTerm, setSearchTerm] = useState('Wallpaper');
  const [currentDeviceOrientation, setCurrentDeviceOrientation] = useState<DeviceOrientationCategory>('smartphone');
  const [wallpapers, setWallpapers] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<PexelsPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const fetchWallpapers = useCallback(async (query: string, deviceCategory: DeviceOrientationCategory, pageNum: number = 1, append: boolean = false) => {
    setLoading(true);
    const orientation = deviceCategory === 'desktop' ? 'landscape' : 'portrait';
    const finalQuery = query.trim() || 'Wallpaper';

    const response = await searchPhotosLib(finalQuery, pageNum, 30, orientation);

    if (response && response.photos && response.photos.length > 0) {
      const newPhotos = response.photos;
      setWallpapers(prev => {
        const combined = append ? [...prev, ...newPhotos] : newPhotos;
        const uniqueMap = new Map(combined.map(item => [`${item.id}-${deviceCategory}`, item]));
        return Array.from(uniqueMap.values());
      });
      setHasMore(!!response.next_page && newPhotos.length > 0 && newPhotos.length === 30);
    } else {
      if (!append) {
        setWallpapers([]);
      }
      setHasMore(false);

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Home Page] Failed to fetch wallpapers for "${finalQuery}" or no results returned from Pexels. Attempting to display mock data.`);
        toast({
          title: "PEXELS API Issue (Home)",
          description: "Could not fetch from Pexels. Displaying mock data. Check console for API key details logged by pexels.ts.",
          variant: "default",
          duration: 10000,
        });

        const mockWidth = deviceCategory === 'desktop' ? 1920 : 1080;
        const mockHeight = deviceCategory === 'desktop' ? 1080 : 1920;
        const mockPhotos: PexelsPhoto[] = Array.from({ length: 15 }).map((_, i) => {
          const photoId = parseInt(`${pageNum}${i}${Date.now() % 10000}`);
          const placeholderUrl = (w: number, h: number) => `https://placehold.co/${w}x${h}.png`;
          
          return {
            id: photoId,
            width: mockWidth,
            height: mockHeight,
            url: `https://example.com/mock-photo/${photoId}`, 
            photographer: 'Mock Photographer',
            photographer_url: 'https://example.com/mock-photographer',
            photographer_id: i,
            avg_color: '#7F7F7F',
            src: { 
              original: placeholderUrl(mockWidth, mockHeight),
              large2x: placeholderUrl(mockWidth, mockHeight),
              large: placeholderUrl(Math.round(mockWidth * 0.75), Math.round(mockHeight * 0.75)),
              medium: placeholderUrl(Math.round(mockWidth * 0.5), Math.round(mockHeight * 0.5)),
              small: placeholderUrl(Math.round(mockWidth * 0.25), Math.round(mockHeight * 0.25)),
              portrait: placeholderUrl(1080, 1920),
              landscape: placeholderUrl(1920, 1080),
              tiny: placeholderUrl(Math.round(mockWidth * 0.05), Math.round(mockHeight * 0.05))
            },
            liked: false,
            alt: `Mock wallpaper for ${finalQuery}, item ${i}, page ${pageNum}`,
          };
        });
        setWallpapers(prev => append ? [...prev, ...mockPhotos] : mockPhotos);
        setHasMore(pageNum < 3); 
      } else if (!append) {
         setWallpapers([]);
      }
    }
    setLoading(false);
  }, [toast]);


  useEffect(() => {
    setPage(1);
    setWallpapers([]);
    setHasMore(true);
    fetchWallpapers(searchTerm, currentDeviceOrientation, 1, false);
  }, [searchTerm, currentDeviceOrientation, fetchWallpapers]);

  const handleDeviceOrientationChange = (newCategory: DeviceOrientationCategory) => {
       if (newCategory !== currentDeviceOrientation) {
           setCurrentDeviceOrientation(newCategory);
           setSearchTerm('Wallpaper'); 
           setPage(1);
           setWallpapers([]);
           setHasMore(true);
       }
   };

   const handleWallpaperCategorySelect = (categoryValue: string) => {
    // Navigate to search page with query parameter
    router.push(`/search?query=${encodeURIComponent(categoryValue)}`);
  };

  const handleSearchSubmit = (newSearchTerm: string) => {
    // Navigate to search page with query parameter
    if (newSearchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(newSearchTerm.trim())}`);
    }
  };


  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchWallpapers(searchTerm, currentDeviceOrientation, nextPage, true);
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


   const gridAspectRatio = currentDeviceOrientation === 'desktop' ? 'aspect-video' : 'aspect-[9/16]';

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
      {imageSchema && <StructuredData data={imageSchema} />}
      <GlobalHeader
        currentDeviceOrientation={currentDeviceOrientation}
        onDeviceOrientationChange={handleDeviceOrientationChange}
        onWallpaperCategorySelect={handleWallpaperCategorySelect}
        onSearchSubmit={handleSearchSubmit}
        initialSearchTerm={searchTerm}
        navigateToSearchPage={true} // SearchBar in GlobalHeader should navigate
      />

      <main className="flex-grow container mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="my-4 sm:my-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">
              {searchTerm === "Wallpaper" ? "Discover Your Next Wallpaper" : `Displaying: "${searchTerm}"`}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Browse our collection or use the search and filters in the header.</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground/90 mt-3">Curated High-Quality Wallpapers</h2>
        </div>

        {loading && wallpapers.length === 0 ? (
             <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4`}>
                {[...Array(15)].map((_, i) => (
                 <Skeleton key={`initial-skeleton-${i}`} className={`${gridAspectRatio} w-full rounded-lg`} />
                ))}
            </div>
        ) : (
          <WallpaperGrid
            photos={wallpapers}
            orientation={currentDeviceOrientation}
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
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mt-4`}>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={`loading-skeleton-${i}`} className={`${gridAspectRatio} w-full rounded-lg`} />
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
