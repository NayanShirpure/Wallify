
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import type { DeviceOrientationCategory, PexelsPhoto, PexelsResponse } from '@/types/pexels';
import { WallpaperOfTheDay } from '@/components/wallpaper-of-the-day';
import { WallpaperSection } from '@/components/wallpaper-section';
import { PreviewDialog } from '@/components/wallpaper/PreviewDialog';
import { useToast } from '@/hooks/use-toast';
import { downloadFile } from '@/lib/utils';
import { getCuratedPhotos, searchPhotos as pexelsSearchPhotosLib } from '@/lib/pexels';

interface DiscoverCategory {
  id: string;
  title: string;
  description: string;
  query: string;
  imageUrl: string;
  dataAiHint: string;
}

const discoverPageCategories: DiscoverCategory[] = [
  { id: 'abstract', title: 'Abstract Art', description: 'Explore mind-bending patterns and colors.', query: 'Abstract Art', imageUrl: 'https://picsum.photos/seed/discover-abstract/600/400', dataAiHint: 'abstract colorful' },
  { id: 'nature', title: 'Nature Escapes', description: 'Breathtaking landscapes and serene wilderness.', query: 'Nature Landscape', imageUrl: 'https://picsum.photos/seed/discover-nature/600/400', dataAiHint: 'nature forest' },
  { id: 'space', title: 'Cosmic Wonders', description: 'Journey through galaxies and nebulae.', query: 'Outer Space Galaxy', imageUrl: 'https://picsum.photos/seed/discover-space/600/400', dataAiHint: 'space galaxy' },
  { id: 'minimalist', title: 'Minimalist Vibes', description: 'Clean lines and simple elegance.', query: 'Minimalist Design', imageUrl: 'https://picsum.photos/seed/discover-minimalist/600/400', dataAiHint: 'minimalist white' },
  { id: 'animals', title: 'Wild Encounters', description: 'Majestic creatures from around the globe.', query: 'Wildlife Animals', imageUrl: 'https://picsum.photos/seed/discover-animals/600/400', dataAiHint: 'wildlife animal' },
  { id: 'cityscapes', title: 'Urban Dreams', description: 'Iconic city skylines and vibrant streets.', query: 'Cityscape Night', imageUrl: 'https://picsum.photos/seed/discover-cityscapes/600/400', dataAiHint: 'city night' },
  { id: 'dark_moody', title: 'Dark & Moody', description: 'Atmospheric and intriguing dark themes.', query: 'Dark Moody Forest', imageUrl: 'https://picsum.photos/seed/discover-darkmoody/600/400', dataAiHint: 'dark abstract' },
  { id: 'vibrant', title: 'Vibrant Hues', description: 'Explosions of color to energize your screen.', query: 'Vibrant Colorful Pattern', imageUrl: 'https://picsum.photos/seed/discover-vibrant/600/400', dataAiHint: 'colorful vibrant' },
];

export default function DiscoverPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentDeviceOrientation, setCurrentDeviceOrientation] = useState<DeviceOrientationCategory>('smartphone');
  
  const [wallpaperOfTheDay, setWallpaperOfTheDay] = useState<PexelsPhoto | null>(null);
  const [loadingWOTD, setLoadingWOTD] = useState(true);
  
  const [trendingWallpapers, setTrendingWallpapers] = useState<PexelsPhoto[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  
  const [editorsPicks, setEditorsPicks] = useState<PexelsPhoto[]>([]);
  const [loadingEditorsPicks, setLoadingEditorsPicks] = useState(true);
  
  const [seasonalWallpapers, setSeasonalWallpapers] = useState<PexelsPhoto[]>([]);
  const [loadingSeasonal, setLoadingSeasonal] = useState(true);
  
  const [themeCollectionCyberpunk, setThemeCollectionCyberpunk] = useState<PexelsPhoto[]>([]);
  const [loadingThemeCyberpunk, setLoadingThemeCyberpunk] = useState(true);

  const [themeCollectionVintage, setThemeCollectionVintage] = useState<PexelsPhoto[]>([]);
  const [loadingThemeVintage, setLoadingThemeVintage] = useState(true);

  const [selectedWallpaper, setSelectedWallpaper] = useState<PexelsPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSectionPhotos = useCallback(async (
    query: string,
    setter: React.Dispatch<React.SetStateAction<PexelsPhoto[]>>,
    loader: React.Dispatch<React.SetStateAction<boolean>>,
    orientation?: 'landscape' | 'portrait' | 'square',
    perPage: number = 10
  ) => {
    loader(true);
    const response = await pexelsSearchPhotosLib(query, 1, perPage, orientation);
    if (response && response.photos) {
      setter(response.photos);
    } else {
      setter([]);
      console.warn(`Failed to fetch photos for query: ${query}`);
    }
    loader(false);
  }, []);

  useEffect(() => {
    const orientationParam = currentDeviceOrientation === 'desktop' ? 'landscape' : 'portrait';

    setLoadingWOTD(true);
    getCuratedPhotos(1, 1).then(data => {
      if (data && data.photos && data.photos.length > 0) {
        setWallpaperOfTheDay(data.photos[0]);
      } else {
        setWallpaperOfTheDay(null);
        console.warn("Failed to fetch wallpaper of the day.");
      }
      setLoadingWOTD(false);
    });

    fetchSectionPhotos("Trending Abstract", setTrendingWallpapers, setLoadingTrending, orientationParam);
    fetchSectionPhotos("Editor's Choice Serene Landscapes", setEditorsPicks, setLoadingEditorsPicks, orientationParam);
    fetchSectionPhotos("Autumn Forest", setSeasonalWallpapers, setLoadingSeasonal, orientationParam);
    fetchSectionPhotos("Cyberpunk City", setThemeCollectionCyberpunk, setLoadingThemeCyberpunk, orientationParam);
    fetchSectionPhotos("Vintage Cars", setThemeCollectionVintage, setLoadingThemeVintage, orientationParam);

  }, [currentDeviceOrientation, fetchSectionPhotos]);

  const handleDeviceOrientationChange = (newCategory: DeviceOrientationCategory) => {
    setCurrentDeviceOrientation(newCategory);
  };

  const handleWallpaperCategorySelect = (categoryValue: string) => {
    router.push(`/search?query=${encodeURIComponent(categoryValue)}`);
  };

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleViewWallpaper = (photo: PexelsPhoto) => {
    setSelectedWallpaper(photo);
    setIsModalOpen(true);
  };

  const handleDownloadWallpaper = async (photo: PexelsPhoto | null) => {
    if (!photo) return;
    const photographerName = photo.photographer.replace(/[^a-zA-Z0-9_-\s]/g, '').replace(/\s+/g, '_');
    const filename = `wallify_${photographerName}_${photo.id}_original.jpg`;
    
    toast({
      title: "Download Starting",
      description: `Preparing ${filename} for download...`,
    });
    try {
      await downloadFile(photo.src.original, filename);
      toast({
        title: "Download Complete",
        description: `${filename} has been downloaded.`,
      });
    } catch (error) {
      console.error('Error downloading wallpaper:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the wallpaper. Please try again.",
        variant: "destructive",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedWallpaper(null), 300);
  };

  return (
    <>
      <GlobalHeader
        currentDeviceOrientation={currentDeviceOrientation}
        onDeviceOrientationChange={handleDeviceOrientationChange}
        onWallpaperCategorySelect={handleWallpaperCategorySelect}
        onSearchSubmit={handleSearchSubmit}
        initialSearchTerm="Discover" 
        navigateToSearchPage={true} // SearchBar should navigate
      />
      <main className="flex-grow container mx-auto max-w-7xl p-4 py-8 md:p-6 md:py-12 space-y-10 sm:space-y-12">
        
        <WallpaperOfTheDay
          wallpaper={wallpaperOfTheDay}
          loading={loadingWOTD}
          orientation={currentDeviceOrientation}
          onViewClick={handleViewWallpaper}
          onDownloadClick={handleDownloadWallpaper}
        />

        <WallpaperSection
          title="Trending Wallpapers"
          wallpapers={trendingWallpapers}
          loading={loadingTrending}
          orientation={currentDeviceOrientation}
          onWallpaperClick={handleViewWallpaper}
          itemCount={8}
        />

        <WallpaperSection
          title="Editor's Picks"
          wallpapers={editorsPicks}
          loading={loadingEditorsPicks}
          orientation={currentDeviceOrientation}
          onWallpaperClick={handleViewWallpaper}
          itemCount={8}
        />
        
        <WallpaperSection
          title="Autumn Vibes"
          wallpapers={seasonalWallpapers}
          loading={loadingSeasonal}
          orientation={currentDeviceOrientation}
          onWallpaperClick={handleViewWallpaper}
          itemCount={8}
        />

        <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary px-1">Theme-Based Collections</h2>
            <WallpaperSection
              title="Cyberpunk Worlds"
              wallpapers={themeCollectionCyberpunk}
              loading={loadingThemeCyberpunk}
              orientation={currentDeviceOrientation}
              onWallpaperClick={handleViewWallpaper}
              itemCount={6}
            />
            <WallpaperSection
              title="Vintage Rides"
              wallpapers={themeCollectionVintage}
              loading={loadingThemeVintage}
              orientation={currentDeviceOrientation}
              onWallpaperClick={handleViewWallpaper}
              itemCount={6}
            />
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6 px-1">Explore Popular Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {discoverPageCategories.map((category) => (
              <Link key={category.id} href={`/search?query=${encodeURIComponent(category.query)}`} passHref legacyBehavior>
                <a className="block group">
                  <Card className="overflow-hidden h-full flex flex-col bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus-within:-translate-y-1 focus-within:shadow-xl rounded-xl">
                    <div className="relative w-full aspect-[16/10] overflow-hidden">
                      <Image
                        src={category.imageUrl}
                        alt={`Preview for ${category.title} category`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                        data-ai-hint={category.dataAiHint}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>
                    <CardHeader className="p-4 flex-grow">
                      <CardTitle className="text-lg sm:text-xl font-semibold text-card-foreground group-hover:text-accent transition-colors">
                        {category.title}
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-sm font-medium text-accent group-hover:underline flex items-center">
                        Explore <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <PreviewDialog
        photo={selectedWallpaper}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
