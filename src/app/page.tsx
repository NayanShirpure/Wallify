
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs" // Import Tabs components
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { downloadFile } from '@/lib/utils';

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
}

type Category = 'smartphone' | 'desktop';

// Use environment variable directly
const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('Nature'); // Default search term
  const [category, setCategory] = useState<Category>('smartphone'); // Default category
  const [wallpapers, setWallpapers] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<PexelsPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

   const fetchWallpapers = useCallback(async (query: string, currentCategory: Category, pageNum: number = 1, append: boolean = false) => {
    if (!PEXELS_API_KEY) {
      console.error("Pexels API key is missing.");
      toast({
        title: "API Key Error",
        description: "Pexels API key is not configured. Please add NEXT_PUBLIC_PEXELS_API_KEY to your environment variables.",
        variant: "destructive",
      });
      setLoading(false);
      setHasMore(false); // Prevent further loading attempts
      return;
    }

    setLoading(true);

    // Construct query based on category
    let finalQuery = query.trim();
    if (currentCategory === 'desktop') {
        finalQuery += " desktop landscape";
    } else { // smartphone
        finalQuery += " phone portrait";
    }
    finalQuery = finalQuery.trim(); // Ensure no leading/trailing spaces

    try {
      const response = await fetch(
        `${PEXELS_API_URL}/search?query=${encodeURIComponent(finalQuery)}&per_page=30&page=${pageNum}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
         if (response.status === 401) { // Unauthorized
            console.error("Pexels API key is invalid or unauthorized.");
             toast({
                title: "API Key Invalid",
                description: "The configured Pexels API key is invalid or unauthorized.",
                variant: "destructive",
             });
             setHasMore(false); // Stop loading more if key is invalid
         } else {
             throw new Error(`HTTP error! status: ${response.status}`);
         }
      } else {
            const data: PexelsResponse = await response.json();

            setWallpapers(prev => append ? [...prev, ...data.photos] : data.photos);
            setHasMore(!!data.next_page && data.photos.length > 0);
      }

    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch wallpapers. Please check your connection and try again.",
        variant: "destructive",
      });
       setHasMore(false); // Stop trying to load more on error
    } finally {
      setLoading(false);
    }
   }, [toast]);


  useEffect(() => {
    // Fetch initial wallpapers based on default term and category
    fetchWallpapers(searchTerm, category, 1);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on initial mount

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSearchTerm = formData.get('search') as string;
    const trimmedSearchTerm = newSearchTerm.trim();

    const effectiveSearchTerm = trimmedSearchTerm || 'Popular'; // Use 'Popular' if search is empty

    // Only trigger a new search if the term actually changes from the current state
    if (effectiveSearchTerm !== searchTerm) {
       setSearchTerm(effectiveSearchTerm);
       setPage(1); // Reset page number on new search
       setWallpapers([]); // Clear existing wallpapers for the new search
       setHasMore(true); // Assume there might be more pages for the new term
       fetchWallpapers(effectiveSearchTerm, category, 1); // Use current category
    }
  };

   const handleCategoryChange = (newCategory: Category) => {
       if (newCategory !== category) {
           setCategory(newCategory);
           setPage(1);
           setWallpapers([]);
           setHasMore(true);
           fetchWallpapers(searchTerm, newCategory, 1); // Fetch with new category
       }
   };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchWallpapers(searchTerm, category, nextPage, true); // Fetch next page and append
    }
  };


  const openModal = (wallpaper: PexelsPhoto) => {
    setSelectedWallpaper(wallpaper);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Delay clearing the selected wallpaper to allow fade-out animation
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

  // Determine which image source to use for the grid based on category
   const gridImageSrc = (wallpaper: PexelsPhoto) => {
      // Prefer portrait for smartphone, landscape for desktop if available, fallback gracefully
      if (category === 'desktop' && wallpaper.src.landscape) return wallpaper.src.landscape;
      if (category === 'smartphone' && wallpaper.src.portrait) return wallpaper.src.portrait;
      return wallpaper.src.large; // Fallback to large if preferred is not available
   };

   // Determine aspect ratio for grid items based on category
   const gridAspectRatio = category === 'desktop' ? 'aspect-video' : 'aspect-[9/16]';
   // Determine image fill/contain based on category for grid
   const gridImageFit = category === 'desktop' ? 'object-cover' : 'object-cover'; // Cover usually looks better in grid


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto max-w-4xl px-4 py-4 flex flex-col items-center gap-4">
            <h1 className="text-3xl font-bold text-center text-primary">Wallify</h1>
             <form onSubmit={handleSearch} className="flex gap-2 items-center w-full max-w-xl">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <Input
                        type="search"
                        name="search"
                        placeholder={`Search ${category} wallpapers...`}
                        className="pl-10 w-full bg-secondary border-border focus:ring-2 focus:ring-ring text-foreground rounded-full h-11"
                        defaultValue={searchTerm}
                        aria-label="Search wallpapers"
                    />
                </div>
                <Button type="submit" variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full h-11 px-6">
                    <Search className="h-4 w-4 md:mr-2" /> <span className="hidden md:inline">Search</span>
                </Button>
            </form>
             {/* Category Selection Tabs */}
             <Tabs value={category} onValueChange={(value) => handleCategoryChange(value as Category)} className="w-full max-w-xs">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="smartphone">Smartphone</TabsTrigger>
                    <TabsTrigger value="desktop">Desktop</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-7xl p-4 md:p-6">
        {loading && wallpapers.length === 0 ? (
            // Skeleton loading state for initial load
             <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4`}>
                {[...Array(15)].map((_, i) => (
                 <Skeleton key={`initial-skeleton-${i}`} className={`${gridAspectRatio} w-full rounded-lg`} />
                ))}
            </div>
        ) : wallpapers.length > 0 ? (
            // Display wallpapers
             <>
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4`}>
                    {wallpapers.map((wallpaper) => (
                    <div
                        key={wallpaper.id}
                        className={`relative ${gridAspectRatio} w-full rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300 ease-in-out hover:scale-105 shadow-md hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background`}
                        onClick={() => openModal(wallpaper)}
                        role="button"
                        aria-label={`View wallpaper: ${wallpaper.alt || `by ${wallpaper.photographer}`}`}
                        tabIndex={0} // Make it focusable
                        onKeyDown={(e) => e.key === 'Enter' && openModal(wallpaper)}
                    >
                        <Image
                        src={gridImageSrc(wallpaper)} // Use dynamic source
                        alt={wallpaper.alt || `Wallpaper by ${wallpaper.photographer}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className={`${gridImageFit} transition-opacity duration-300 group-hover:opacity-80`} // Use dynamic fit
                        placeholder="blur"
                        blurDataURL={wallpaper.src.tiny}
                        data-ai-hint="wallpaper background phone desktop" // AI hint
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 justify-between">
                         <p className="text-white text-xs truncate drop-shadow-sm">{wallpaper.alt || `By ${wallpaper.photographer}`}</p>
                         <Download size={16} className="text-white/80 shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>
                    ))}
                </div>

                 {/* Load More Button */}
                 {hasMore && !loading && (
                    <div className="flex justify-center mt-8 mb-4">
                        <Button onClick={handleLoadMore} variant="outline" size="lg">
                        Load More
                        </Button>
                    </div>
                 )}

                 {/* Loading indicator for pagination */}
                 {loading && (
                     <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4`}>
                        {[...Array(5)].map((_, i) => (
                         <Skeleton key={`loading-skeleton-${i}`} className={`${gridAspectRatio} w-full rounded-lg`} />
                        ))}
                    </div>
                 )}
            </>
        ) : (
             // No results found state
             !loading && <p className="text-center text-muted-foreground mt-10 text-lg">No {category} wallpapers found for "{searchTerm}". Try a different search term or category.</p>
        )}
      </main>

      {/* Preview Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-md w-[90vw] p-0 border-none !rounded-xl overflow-hidden shadow-2xl bg-card/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                 {selectedWallpaper && (
                <>
                     <DialogHeader className="absolute top-0 left-0 z-30 p-4 w-full flex flex-row justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                         <div className="flex flex-col mr-4 overflow-hidden">
                             <DialogTitle className="text-base font-semibold text-white truncate">{selectedWallpaper.alt || `Wallpaper by ${selectedWallpaper.photographer}`}</DialogTitle>
                             <DialogDescription className="text-xs text-gray-300">
                                Photo by <a href={selectedWallpaper.photographer_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded">{selectedWallpaper.photographer}</a>
                             </DialogDescription>
                         </div>
                         <DialogClose
                            onClick={closeModal}
                            className="text-white bg-black/30 rounded-full p-1.5 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/30 transition-colors shrink-0"
                            aria-label="Close preview"
                         >
                            <X size={18} />
                        </DialogClose>
                    </DialogHeader>

                    {/* Image Container - adjust aspect ratio based on selected category potentially or keep fixed */}
                     <div className={`relative w-full ${gridAspectRatio === 'aspect-video' ? 'aspect-video' : 'aspect-[9/16]'} max-h-[75vh] bg-black/50 flex items-center justify-center`}>
                         <Image
                            src={selectedWallpaper.src.large2x || selectedWallpaper.src.original} // Use higher res for modal
                            alt={selectedWallpaper.alt || `Preview of wallpaper by ${selectedWallpaper.photographer}`}
                            fill
                            sizes="(max-width: 768px) 90vw, 50vw"
                            className="object-contain" // Contain ensures the whole image is visible
                            priority
                            placeholder="blur"
                            blurDataURL={selectedWallpaper.src.tiny}
                         />
                    </div>

                     <DialogFooter className="absolute bottom-0 left-0 z-30 p-4 w-full flex justify-end bg-gradient-to-t from-black/50 to-transparent">
                        <Button onClick={handleDownload} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md rounded-full px-5 py-2.5 text-sm" disabled={loading}>
                            <Download className="mr-2 h-4 w-4" />
                            {loading ? 'Downloading...' : 'Download Original'}
                        </Button>
                    </DialogFooter>
                 </>
                )}
            </DialogContent>
        </Dialog>

      <footer className="text-center text-muted-foreground text-xs mt-auto py-5 border-t border-border bg-secondary/50">
        Wallpapers provided by <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded">Pexels</a>.
        App built with Firebase & Next.js.
      </footer>
    </div>
  );
}

