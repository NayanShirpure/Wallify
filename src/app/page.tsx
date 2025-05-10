
'use client';

import type { PexelsPhoto, PexelsResponse } from '@/types/pexels';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, X, Menu, Twitter, Instagram, Github } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { downloadFile } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { wallpaperCategories, type Category } from '@/config/categories';
import { StructuredData } from '@/components/structured-data';
import type { ImageObject, WithContext } from 'schema-dts';


const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY || "lc7gpWWi2bcrekjM32zdi1s68YDYmEWMeudlsDNNMVEicIIke3G8Iamw";
const PEXELS_API_URL = 'https://api.pexels.com/v1';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';


export default function Home() {
  const [searchTerm, setSearchTerm] = useState('Wallpaper');
  const [currentCategory, setCurrentCategory] = useState<Category>('smartphone');
  const [wallpapers, setWallpapers] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<PexelsPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

   const fetchWallpapers = useCallback(async (query: string, category: Category, pageNum: number = 1, append: boolean = false) => {
    if (!PEXELS_API_KEY) {
      console.error("Pexels API key is missing.");
      if (process.env.NODE_ENV === 'development') {
          toast({
            title: "API Key Error",
            description: "Pexels API key is not configured. Please add NEXT_PUBLIC_PEXELS_API_KEY to your environment variables.",
            variant: "destructive",
          });
      } else {
         toast({
            title: "Configuration Error",
            description: "Could not fetch wallpapers due to a configuration issue.",
            variant: "destructive",
         });
      }
      setLoading(false);
      setHasMore(false);
      return;
    }

    setLoading(true);
    const orientation = category === 'desktop' ? 'landscape' : 'portrait';
    let finalQuery = query.trim() || 'Wallpaper';

    try {
      const apiUrl = `${PEXELS_API_URL}/search?query=${encodeURIComponent(finalQuery)}&orientation=${orientation}&per_page=30&page=${pageNum}`;
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });

      if (!response.ok) {
         if (response.status === 401) {
            console.error("Pexels API key is invalid or unauthorized.");
            if (process.env.NODE_ENV === 'development') {
                 toast({
                    title: "API Key Invalid",
                    description: "The configured Pexels API key is invalid or unauthorized.",
                    variant: "destructive",
                 });
             } else {
                  toast({
                    title: "Authentication Error",
                    description: "Could not authenticate with the image provider.",
                    variant: "destructive",
                });
             }
             setHasMore(false);
         } else {
             console.error(`HTTP error! status: ${response.status}, URL: ${apiUrl}`);
             throw new Error(`HTTP error! status: ${response.status}`);
         }
      } else {
            const data: PexelsResponse = await response.json();
            const newPhotos = data.photos || [];

            setWallpapers(prev => {
              const combined = append ? [...prev, ...newPhotos] : newPhotos;
              const uniqueMap = new Map(combined.map(item => [`${item.id}-${category}`, item]));
              return Array.from(uniqueMap.values());
            });
            setHasMore(!!data.next_page && newPhotos.length > 0);
      }

    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch wallpapers. Please check your connection and try again.",
        variant: "destructive",
      });
       setHasMore(false);
    } finally {
      setLoading(false);
    }
   }, [toast]);


  useEffect(() => {
    fetchWallpapers(searchTerm, currentCategory, 1);
  }, [searchTerm, currentCategory, fetchWallpapers]);


  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSearchTerm = formData.get('search') as string;
    const trimmedSearchTerm = newSearchTerm.trim();
    const effectiveSearchTerm = trimmedSearchTerm || 'Wallpaper';

    setSearchTerm(effectiveSearchTerm);
    setPage(1);
    setWallpapers([]);
    setHasMore(true);
  };

  const handleDeviceCategoryChange = (newCategory: Category) => {
       if (newCategory !== currentCategory) {
           setCurrentCategory(newCategory);
           setPage(1);
           setWallpapers([]);
           setHasMore(true);
       }
   };

   const handleWallpaperCategorySelect = (categoryValue: string) => {
    setSearchTerm(categoryValue);
    setPage(1);
    setWallpapers([]);
    setHasMore(true);
  };


  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchWallpapers(searchTerm, currentCategory, nextPage, true);
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

  const handleDownload = async () => {
    if (!selectedWallpaper) return;
    const photographerName = selectedWallpaper.photographer.replace(/[^a-zA-Z0-9_-\s]/g, '').replace(/\s+/g, '_');
    const filename = `wallify_${photographerName}_${selectedWallpaper.id}.jpg`;
    toast({
        title: "Download Starting",
        description: `Preparing ${filename} for download...`,
      });
    try {
      await downloadFile(selectedWallpaper.src.original, filename);
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

   const gridImageSrc = (wallpaper: PexelsPhoto) => {
      if (currentCategory === 'desktop' && wallpaper.src.landscape) return wallpaper.src.landscape;
      if (currentCategory === 'smartphone' && wallpaper.src.portrait) return wallpaper.src.portrait;
      if (currentCategory === 'desktop') return wallpaper.src.large2x || wallpaper.src.large || wallpaper.src.original;
      if (currentCategory === 'smartphone') return wallpaper.src.large || wallpaper.src.medium || wallpaper.src.original;
      return wallpaper.src.large;
   };

   const gridAspectRatio = currentCategory === 'desktop' ? 'aspect-video' : 'aspect-[9/16]';
   const gridImageFit = 'object-cover';


   const modalAspectRatio = selectedWallpaper
    ? selectedWallpaper.width / selectedWallpaper.height > 1.2
        ? 'aspect-video'
        : 'aspect-[9/16]'
    : gridAspectRatio;

  const imageSchema = selectedWallpaper ? {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: selectedWallpaper.alt || `Wallpaper by ${selectedWallpaper.photographer}`,
    description: selectedWallpaper.alt || `High-resolution wallpaper by ${selectedWallpaper.photographer}. Dimensions: ${selectedWallpaper.width}x${selectedWallpaper.height}.`,
    contentUrl: selectedWallpaper.src.original,
    thumbnailUrl: selectedWallpaper.src.medium,
    width: { '@type': 'Distance', value: selectedWallpaper.width, unitCode: 'E37' },
    height: { '@type': 'Distance', value: selectedWallpaper.height, unitCode: 'E37' },
    author: {
      '@type': 'Person',
      name: selectedWallpaper.photographer,
      url: selectedWallpaper.photographer_url,
    },
    copyrightHolder: {
      '@type': 'Person',
      name: selectedWallpaper.photographer,
      url: selectedWallpaper.photographer_url,
    },
    license: 'https://www.pexels.com/license/',
    acquireLicensePage: selectedWallpaper.url,
    provider: {
      '@type': 'Organization',
      name: 'Pexels',
      url: 'https://www.pexels.com',
    },
  } as WithContext<ImageObject> : null;


  return (
    <>
      {imageSchema && <StructuredData data={imageSchema} />}
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-primary self-center sm:self-auto">Wallify</Link>

              <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center w-full sm:w-auto sm:flex-grow max-w-xs sm:max-w-sm md:max-w-md">
                  <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                      <Input
                          type="search"
                          name="search"
                          placeholder="Search..."
                          className="pl-8 w-full bg-secondary border-border focus:ring-1 focus:ring-ring text-foreground rounded-full h-8 text-sm"
                          defaultValue={searchTerm === "Wallpaper" ? "" : searchTerm}
                          aria-label="Search wallpapers"
                      />
                  </div>
                  <Button type="submit" variant="default" size="icon" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-8 w-8 text-sm shrink-0">
                      <Search className="h-3.5 w-3.5" />
                      <span className="sr-only">Search</span>
                  </Button>
              </form>

              <div className="flex items-center gap-2">
                <Tabs value={currentCategory} onValueChange={(value) => handleDeviceCategoryChange(value as Category)} className="w-auto">
                  <TabsList className="grid grid-cols-2 h-8 text-xs">
                      <TabsTrigger value="smartphone" className="text-xs px-2.5 py-1">Phone</TabsTrigger>
                      <TabsTrigger value="desktop" className="text-xs px-2.5 py-1">Desktop</TabsTrigger>
                  </TabsList>
                </Tabs>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Menu className="h-4 w-4" />
                      <span className="sr-only">Categories Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
                    <DropdownMenuLabel>Wallpaper Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {wallpaperCategories.map((cat) => (
                      <DropdownMenuItem key={cat.value} onSelect={() => handleWallpaperCategorySelect(cat.value)}>
                        {cat.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>
        </header>

        <main className="flex-grow container mx-auto max-w-7xl p-4 md:p-6">
          {loading && wallpapers.length === 0 ? (
               <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4`}>
                  {[...Array(15)].map((_, i) => (
                   <Skeleton key={`initial-skeleton-${i}`} className={`${gridAspectRatio} w-full rounded-lg`} />
                  ))}
              </div>
          ) : wallpapers.length > 0 ? (
               <>
                  <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4`}>
                      {wallpapers.map((wallpaper) => (
                      <div
                          key={`${wallpaper.id}-${currentCategory}`}
                          className={`relative ${gridAspectRatio} w-full rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300 ease-in-out hover:scale-105 shadow-md hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background`}
                          onClick={() => openModal(wallpaper)}
                          role="button"
                          aria-label={`View wallpaper: ${wallpaper.alt || `by ${wallpaper.photographer}`}`}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && openModal(wallpaper)}
                      >
                          <Image
                          src={gridImageSrc(wallpaper)}
                          alt={wallpaper.alt || `Wallpaper by ${wallpaper.photographer}`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          className={`${gridImageFit} transition-opacity duration-300 group-hover:opacity-80`}
                          placeholder="blur"
                          blurDataURL={wallpaper.src.tiny}
                          data-ai-hint={`${currentCategory === 'desktop' ? 'desktop background' : 'phone wallpaper'} ${wallpaper.alt ? wallpaper.alt.split(' ').slice(0,2).join(' ') : 'wallpaper'}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-1.5 sm:p-2 justify-between">
                           <p className="text-white text-[10px] sm:text-xs truncate drop-shadow-sm">{wallpaper.alt || `By ${wallpaper.photographer}`}</p>
                           <Download size={14} className="text-white/80 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:size-4" />
                          </div>
                      </div>
                      ))}
                  </div>

                   {hasMore && !loading && (
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
              </>
          ) : (
               !loading && <p className="text-center text-muted-foreground mt-10 text-lg">No {currentCategory} wallpapers found for "{searchTerm}". Try a different search term or category.</p>
          )}
        </main>

          <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
            if (!isOpen) closeModal();
            else setIsModalOpen(true);
          }}>
              <DialogContent className="max-w-md w-[90vw] sm:w-full p-0 border-none !rounded-xl overflow-hidden shadow-2xl bg-card/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                   {selectedWallpaper && (
                  <>
                       <DialogHeader className="absolute top-0 left-0 right-0 z-30 p-3 sm:p-4 flex flex-row justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                           <div className="flex flex-col mr-4 overflow-hidden">
                               <DialogTitle className="text-sm sm:text-base font-semibold text-white truncate">{selectedWallpaper.alt || `Wallpaper by ${selectedWallpaper.photographer}`}</DialogTitle>
                               <DialogDescription className="text-xs text-gray-300">
                                  Photo by <a href={selectedWallpaper.photographer_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded">{selectedWallpaper.photographer}</a>
                               </DialogDescription>
                           </div>
                           <DialogClose
                              onClick={closeModal}
                              className="text-white bg-black/30 rounded-full p-1 sm:p-1.5 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/30 transition-colors shrink-0"
                              aria-label="Close preview"
                           >
                              <X size={16} className="sm:size-[18px]" />
                          </DialogClose>
                      </DialogHeader>

                       <div className={`relative w-full ${modalAspectRatio} max-h-[70vh] sm:max-h-[75vh] bg-black/50 flex items-center justify-center overflow-hidden`}>
                           <Image
                              src={selectedWallpaper.src.large2x || selectedWallpaper.src.original}
                              alt={selectedWallpaper.alt || `Preview of wallpaper by ${selectedWallpaper.photographer}`}
                              fill
                              sizes="(max-width: 768px) 90vw, 50vw"
                              className="object-contain"
                              priority
                              placeholder="blur"
                              blurDataURL={selectedWallpaper.src.tiny}
                           />
                      </div>

                       <DialogFooter className="absolute bottom-0 left-0 right-0 z-30 p-3 sm:p-4 flex justify-end bg-gradient-to-t from-black/50 to-transparent">
                          <Button onClick={handleDownload} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm">
                              <Download className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              Download Original
                          </Button>
                      </DialogFooter>
                   </>
                  )}
              </DialogContent>
          </Dialog>

        <footer className="text-center text-muted-foreground text-xs mt-auto py-3 sm:py-4 border-t border-border bg-background/50">
           <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-3 px-4">
              <p className="text-center md:text-left">
                  Wallpapers provided by <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded">Pexels</a>. © 2025 Wallify. All rights reserved.
              </p>
              <div className="flex items-center gap-x-3 sm:gap-x-4">
                <a href="https://x.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-accent transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-accent transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-accent transition-colors">
                  <Github className="h-4 w-4" />
                </a>
              </div>
              <nav className="flex gap-x-3 sm:gap-x-4 gap-y-1 flex-wrap justify-center md:justify-end">
                  <Link href="/about" className="underline hover:text-accent">About</Link>
                  <Link href="/privacy-policy" className="underline hover:text-accent">Privacy</Link>
                  <Link href="/terms-conditions" className="underline hover:text-accent">Terms</Link>
                  <Link href="/contact" className="underline hover:text-accent">Contact</Link>
              </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
