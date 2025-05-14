
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
  // Aspect ratio adjustments for more cinematic feel on desktop and better fit on mobile
  const aspectRatio = orientation === 'desktop' 
    ? 'aspect-video sm:aspect-[18/9] md:aspect-[21/9] lg:aspect-[24/9]' 
    : 'aspect-[9/16] xs:aspect-[9/15] sm:aspect-[9/14]';
  const containerHeight = orientation === 'desktop' 
    ? 'max-h-[280px] xs:max-h-[320px] sm:max-h-[380px] md:max-h-[420px] lg:max-h-[450px]' 
    : 'max-h-[400px] xs:max-h-[480px] sm:max-h-[550px]';


  const getSrc = (photo: PexelsPhoto) => {
    // Prioritize higher quality sources for WOTD
    if (orientation === 'desktop') return photo.src.original || photo.src.large2x;
    return photo.src.large2x || photo.src.original || photo.src.portrait;
  };

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6 px-1">Wallpaper of the Day</h2>
        <Skeleton className={`w-full ${aspectRatio} ${containerHeight} rounded-xl shadow-lg`} />
      </section>
    );
  }

  if (!wallpaper) {
    return (
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6 px-1">Wallpaper of the Day</h2>
        <div className={`flex items-center justify-center w-full ${aspectRatio} ${containerHeight} rounded-xl bg-muted/30 border border-dashed border-border shadow-inner`}>
            <p className="text-muted-foreground">Wallpaper of the Day is currently unavailable.</p>
        </div>
      </section>
    );
  }

  const imageAlt = (wallpaper.alt && wallpaper.alt.trim() !== '') ? wallpaper.alt : `Wallpaper of the day by ${wallpaper.photographer}`;
  const titleAlt = (wallpaper.alt && wallpaper.alt.trim() !== '') ? wallpaper.alt : 'Featured Wallpaper';

  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6 px-1">Wallpaper of the Day</h2>
      <div
        className={`relative w-full ${aspectRatio} ${containerHeight} rounded-xl overflow-hidden group shadow-xl hover:shadow-2xl focus-within:shadow-2xl transition-all duration-300 ease-in-out`}
      >
        <Image
          src={getSrc(wallpaper)}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1000px" // Adjusted sizes for better LCP
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-focus-within:scale-105"
          priority // WOTD is likely LCP candidate
          placeholder="blur"
          blurDataURL={wallpaper.src.tiny}
          data-ai-hint={`featured daily ${orientation === 'desktop' ? 'desktop art' : 'phone scene'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent flex flex-col justify-end p-3 xs:p-4 sm:p-6 md:p-8">
          <div className="text-white">
            <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg leading-tight">
              {titleAlt}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 drop-shadow-md mt-0.5 sm:mt-1">
              By <a 
                    href={wallpaper.photographer_url} 
                    target="_blank" rel="noopener noreferrer" 
                    className="underline hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded"
                    aria-label={`View profile of photographer ${wallpaper.photographer}`}
                  >
                    {wallpaper.photographer}
                  </a>
            </p>
          </div>
          <div className="mt-2 xs:mt-3 sm:mt-4 flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewClick(wallpaper)}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 shadow-md text-xs sm:text-sm px-3 py-1.5 h-auto sm:h-9"
              aria-label="Preview wallpaper of the day"
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Preview
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => onDownloadClick(wallpaper)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md text-xs sm:text-sm px-3 py-1.5 h-auto sm:h-9"
              aria-label="Download wallpaper of the day"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}