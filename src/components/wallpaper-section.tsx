'use client';

import type { PexelsPhoto, DeviceOrientationCategory } from '@/types/pexels';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';

interface WallpaperSectionProps {
  title: string;
  wallpapers: PexelsPhoto[];
  loading: boolean;
  orientation: DeviceOrientationCategory;
  onWallpaperClick: (wallpaper: PexelsPhoto) => void;
  itemCount?: number;
}

export function WallpaperSection({
  title,
  wallpapers,
  loading,
  orientation,
  onWallpaperClick,
  itemCount = 8, // Default to 8 items for sections
}: WallpaperSectionProps) {
  const aspectRatio = orientation === 'desktop' ? 'aspect-video' : 'aspect-[9/16]';
  // Adjusted widths for a responsive horizontal scroll, Tailwind classes define max-width basically
  const imageContainerClass = orientation === 'desktop' 
    ? 'w-60 md:w-72 lg:w-80' // Wider for desktop landscape
    : 'w-32 md:w-36 lg:w-40'; // Narrower for mobile portrait

  const displayedWallpapers = wallpapers.slice(0, itemCount);

  const getSrc = (photo: PexelsPhoto) => {
    // Prioritize orientation-specific crops, then fall back
    if (orientation === 'desktop') {
      return photo.src.landscape || photo.src.large || photo.src.original;
    }
    // Smartphone (portrait)
    return photo.src.portrait || photo.src.medium || photo.src.original;
  };

  return (
    <section className="mb-6 sm:mb-10">
      <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4 px-1">{title}</h2>
      {loading ? (
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-3 px-1">
          {[...Array(Math.min(itemCount, 4))].map((_, i) => ( // Show a few skeletons
            <div key={`skeleton-${title}-${i}`} className={`flex-shrink-0 ${imageContainerClass}`}>
              <Skeleton className={`${aspectRatio} w-full rounded-lg`} />
            </div>
          ))}
        </div>
      ) : wallpapers.length > 0 ? (
        <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-3 px-1"> {/* Added pb-3 for scrollbar space */}
          {displayedWallpapers.map((wallpaper) => (
            <div
              key={`${wallpaper.id}-${orientation}-${title}`}
              className={`relative ${imageContainerClass} ${aspectRatio} flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-transform duration-200 ease-in-out hover:scale-102`}
              onClick={() => onWallpaperClick(wallpaper)}
              role="button"
              aria-label={`View wallpaper: ${wallpaper.alt || `by ${wallpaper.photographer}`}`}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onWallpaperClick(wallpaper)}
            >
              <Image
                src={getSrc(wallpaper)}
                alt={wallpaper.alt || `Wallpaper by ${wallpaper.photographer}`}
                fill
                sizes={`(max-width: 768px) 40vw, ${imageContainerClass.split(' ').find(c => c.startsWith('lg:w-'))?.replace('lg:w-','') || '200'}px`} // Approximate sizes
                className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                placeholder="blur"
                blurDataURL={wallpaper.src.tiny}
                data-ai-hint={`${orientation === 'desktop' ? 'desktop background' : 'phone wallpaper'} ${wallpaper.alt ? wallpaper.alt.split(' ').slice(0,2).join(' ') : 'wallpaper'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-1.5 sm:p-2 justify-between">
                <p className="text-white text-[10px] sm:text-xs truncate drop-shadow-sm">{wallpaper.alt || `By ${wallpaper.photographer}`}</p>
                <Download size={12} sm-size={14} className="text-white/70 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground px-1 text-sm">No wallpapers available for this section right now.</p>
      )}
    </section>
  );
}
