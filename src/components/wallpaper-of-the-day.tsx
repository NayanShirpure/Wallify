'use client';

import type { PexelsPhoto, DeviceOrientationCategory } from '@/types/pexels';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

interface WallpaperOfTheDayProps {
  wallpaper: PexelsPhoto | null;
  loading: boolean;
  orientation: DeviceOrientationCategory;
  onViewClick: (wallpaper: PexelsPhoto) => void;
  onDownloadClick: (wallpaper: PexelsPhoto) => Promise<void>;
}

export function WallpaperOfTheDay({
  wallpaper,
  loading,
  orientation,
  onViewClick,
  onDownloadClick,
}: WallpaperOfTheDayProps) {
  const aspectRatio = orientation === 'desktop' ? 'aspect-video sm:aspect-[18/9] md:aspect-[21/9]' : 'aspect-[9/16] sm:aspect-[9/14]'; // More cinematic for desktop WOTD
  const containerHeight = orientation === 'desktop' ? 'max-h-[300px] sm:max-h-[400px] md:max-h-[450px]' : 'max-h-[450px] sm:max-h-[550px]';


  const getSrc = (photo: PexelsPhoto) => {
    if (orientation === 'desktop') return photo.src.original; // Highest quality for desktop WOTD
    return photo.src.large2x || photo.src.original; // High quality for mobile WOTD
  };

  if (loading) {
    return (
      <section className="mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4 px-1">Wallpaper of the Day</h2>
        <Skeleton className={`w-full ${aspectRatio} ${containerHeight} rounded-xl`} />
      </section>
    );
  }

  if (!wallpaper) {
    return (
      <section className="mb-6 sm:mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4 px-1">Wallpaper of the Day</h2>
        <div className={`flex items-center justify-center w-full ${aspectRatio} ${containerHeight} rounded-xl bg-muted/50 border border-dashed`}>
            <p className="text-muted-foreground">Wallpaper of the Day is currently unavailable.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-6 sm:mb-10">
      <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4 px-1">Wallpaper of the Day</h2>
      <div
        className={`relative w-full ${aspectRatio} ${containerHeight} rounded-xl overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out`}
      >
        <Image
          src={getSrc(wallpaper)}
          alt={wallpaper.alt || `Wallpaper of the day by ${wallpaper.photographer}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px" // General sizes
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          priority // This is likely an LCP candidate
          placeholder="blur"
          blurDataURL={wallpaper.src.tiny}
          data-ai-hint={`daily featured ${orientation === 'desktop' ? 'desktop background' : 'phone wallpaper'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8">
          <div className="text-white">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg">{wallpaper.alt || 'Featured Wallpaper'}</h3>
            <p className="text-xs sm:text-sm text-gray-200 drop-shadow-md">
              By <a href={wallpaper.photographer_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded">{wallpaper.photographer}</a>
            </p>
          </div>
          <div className="mt-3 sm:mt-4 flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewClick(wallpaper)}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 shadow-md"
              aria-label="Preview wallpaper of the day"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Preview
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onDownloadClick(wallpaper)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
              aria-label="Download wallpaper of the day"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
