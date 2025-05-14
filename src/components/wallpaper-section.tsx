
'use client';

import type { PexelsPhoto, DeviceOrientationCategory } from '@/types/pexels';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { WallpaperCard } from './wallpaper/WallpaperCard'; // Import WallpaperCard for consistent item rendering

interface WallpaperSectionProps {
  title: string;
  wallpapers: PexelsPhoto[];
  loading: boolean;
  orientation: DeviceOrientationCategory; // This orientation is for the *type* of content (desktop/phone)
  onWallpaperClick: (wallpaper: PexelsPhoto) => void;
  itemCount?: number;
}

export function WallpaperSection({
  title,
  wallpapers,
  loading,
  orientation, // This is the general orientation context for the content type
  onWallpaperClick,
  itemCount = 10, 
}: WallpaperSectionProps) {
  // For carousel display, items can maintain their natural orientation (derived from API)
  // or be forced. WallpaperCard itself handles aspect ratio based on its `orientation` prop.
  // Here, `orientation` prop of WallpaperSection dictates what kind of data we *expect*
  // and what orientation WallpaperCard *should* use.
  
  const displayedWallpapers = wallpapers.slice(0, itemCount);

  // Skeleton item width should match card width in carousel
  // These widths are approximate and aim for a good carousel look.
  const skeletonItemWidth = orientation === 'desktop' 
    ? 'w-60 xs:w-64 sm:w-72 md:w-80 lg:w-[340px]' // Wider for desktop context items
    : 'w-32 xs:w-36 sm:w-40 md:w-44 lg:w-48'; // Narrower for phone context items

  return (
    <section className="py-2">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6 px-1">{title}</h2>
      {loading ? (
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1">
          {[...Array(Math.min(itemCount, 5))].map((_, i) => ( // Show up to 5 skeletons for sections
            <div key={`skeleton-${title}-${i}`} className={cn("flex-shrink-0", skeletonItemWidth)}>
              <Skeleton className={cn(
                "w-full rounded-md md:rounded-lg shadow-sm",
                orientation === 'desktop' ? 'aspect-video' : 'aspect-[9/16]' // Skeleton matches the expected item orientation
                )} />
            </div>
          ))}
        </div>
      ) : wallpapers.length > 0 ? (
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 pt-1 px-1 -mx-1">
          {displayedWallpapers.map((wallpaper) => (
            <div 
              key={`${wallpaper.id}-${orientation}-${title}`} 
              className={cn("flex-shrink-0", skeletonItemWidth)} 
            >
              <WallpaperCard
                photo={wallpaper}
                onClick={() => onWallpaperClick(wallpaper)}
                orientation={orientation} // Pass the section's orientation to the card
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground px-1 text-sm">No wallpapers available for this section right now.</p>
      )}
    </section>
  );
}

