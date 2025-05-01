
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
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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

const PEXELS_API_KEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY; // Store API key in environment variables
const PEXELS_API_URL = 'https://api.pexels.com/v1';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('Nature'); // Default search term
  const [wallpapers, setWallpapers] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<PexelsPhoto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

   const fetchWallpapers = useCallback(async (query: string, pageNum: number = 1, append: boolean = false) => {
    if (!PEXELS_API_KEY) {
      console.error("Pexels API key is missing.");
      toast({
        title: "API Key Error",
        description: "Pexels API key is not configured. Please add NEXT_PUBLIC_PEXELS_API_KEY to your environment variables.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&per_page=30&page=${pageNum}`,
        {
          headers: {
            Authorization: PEXELS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PexelsResponse = await response.json();

      setWallpapers(prev => append ? [...prev, ...data.photos] : data.photos);
      setHasMore(!!data.next_page); // Check if there is a next page

    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch wallpapers. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);


  useEffect(() => {
    fetchWallpapers(searchTerm, 1); // Initial fetch
  }, [fetchWallpapers, searchTerm]); // Depend on fetchWallpapers and searchTerm

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newSearchTerm = formData.get('search') as string;
    if (newSearchTerm.trim() !== searchTerm) {
       setSearchTerm(newSearchTerm.trim() || 'Popular'); // Fallback to 'Popular' if empty
       setPage(1); // Reset page number on new search
       setWallpapers([]); // Clear existing wallpapers
       fetchWallpapers(newSearchTerm.trim() || 'Popular', 1);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchWallpapers(searchTerm, nextPage, true); // Fetch next page and append
    }
  };


  const openModal = (wallpaper: PexelsPhoto) => {
    setSelectedWallpaper(wallpaper);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWallpaper(null);
  };

  const handleDownload = async () => {
    if (!selectedWallpaper) return;

    try {
      const response = await fetch(selectedWallpaper.src.original);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Sanitize filename
      const photographerName = selectedWallpaper.photographer.replace(/[^a-zA-Z0-9_-\s]/g, '');
      const filename = `wallify_${photographerName}_${selectedWallpaper.id}.jpg`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      toast({
        title: "Download Started",
        description: `${filename} is downloading.`,
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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6">
      <header className="mb-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-4 -mx-4 px-4 md:-mx-6 md:px-6 border-b border-border">
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold text-center mb-4 text-primary-foreground mix-blend-difference">Wallify</h1>
             <form onSubmit={handleSearch} className="flex gap-2 items-center">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="search"
                        name="search"
                        placeholder="Search wallpapers (e.g., Abstract, Mountains...)"
                        className="pl-10 w-full bg-secondary border-none focus:ring-2 focus:ring-ring text-foreground"
                        defaultValue={searchTerm}
                        aria-label="Search wallpapers"
                    />
                </div>
                <Button type="submit" variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90 border-none">
                    Search
                </Button>
            </form>
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-6xl">
        {loading && wallpapers.length === 0 ? (
            // Skeleton loading state for initial load
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...Array(15)].map((_, i) => (
                 <Skeleton key={i} className="aspect-[9/16] w-full rounded-lg" />
                ))}
            </div>
        ) : wallpapers.length > 0 ? (
            // Display wallpapers
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {wallpapers.map((wallpaper) => (
                <div
                    key={wallpaper.id}
                    className="relative aspect-[9/16] w-full rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300 ease-in-out hover:scale-105 shadow-md"
                    onClick={() => openModal(wallpaper)}
                    role="button"
                    aria-label={`View wallpaper: ${wallpaper.alt || `by ${wallpaper.photographer}`}`}
                    tabIndex={0} // Make it focusable
                    onKeyDown={(e) => e.key === 'Enter' && openModal(wallpaper)} // Allow activation with Enter key
                >
                    <Image
                    src={wallpaper.src.portrait} // Use portrait for grid view
                    alt={wallpaper.alt || `Wallpaper by ${wallpaper.photographer}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-opacity duration-300 group-hover:opacity-80"
                    placeholder="blur"
                    blurDataURL={wallpaper.src.tiny} // Use tiny version for placeholder
                    data-ai-hint="wallpaper background" // AI hint
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <p className="text-white text-xs truncate">{wallpaper.alt || `Photo by ${wallpaper.photographer}`}</p>
                    </div>
                </div>
                ))}
            </div>
        ) : (
             // No results found state
             !loading && <p className="text-center text-muted-foreground mt-10">No wallpapers found for "{searchTerm}". Try a different search.</p>
        )}

         {/* Load More Button */}
         {hasMore && !loading && wallpapers.length > 0 && (
            <div className="flex justify-center mt-8">
                <Button onClick={handleLoadMore} variant="outline">
                Load More
                </Button>
            </div>
        )}

         {/* Loading indicator for pagination */}
         {loading && wallpapers.length > 0 && (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {[...Array(5)].map((_, i) => (
                 <Skeleton key={`loading-${i}`} className="aspect-[9/16] w-full rounded-lg" />
                ))}
            </div>
         )}
      </main>

      {/* Preview Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-3xl w-full p-0 border-none overflow-hidden !rounded-lg">
                 {selectedWallpaper && (
                <>
                    <DialogHeader className="absolute top-0 left-0 z-10 p-4 bg-gradient-to-b from-black/60 to-transparent w-full">
                        {/* Close button positioned top-right within the content area */}
                         <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-1.5 hover:bg-black/50 transition-colors z-20"
                            aria-label="Close preview"
                         >
                            <X size={20} />
                        </button>
                         <DialogTitle className="text-lg font-semibold text-white truncate mr-10">{selectedWallpaper.alt || `Wallpaper by ${selectedWallpaper.photographer}`}</DialogTitle>
                         <DialogDescription className="text-sm text-gray-300">
                            Photo by <a href={selectedWallpaper.photographer_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">{selectedWallpaper.photographer}</a> on Pexels
                         </DialogDescription>
                    </DialogHeader>
                     <div className="relative w-full aspect-[9/16] max-h-[80vh] bg-black">
                         <Image
                            src={selectedWallpaper.src.large2x} // Use higher resolution for preview
                            alt={selectedWallpaper.alt || `Preview of wallpaper by ${selectedWallpaper.photographer}`}
                            fill
                            sizes="100vw" // Takes full viewport width in modal
                            className="object-contain" // Contain ensures the whole image is visible
                            priority // Prioritize loading the modal image
                         />
                    </div>
                     <DialogFooter className="absolute bottom-0 left-0 z-10 p-4 bg-gradient-to-t from-black/60 to-transparent w-full flex justify-end">
                        <Button onClick={handleDownload} className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </DialogFooter>
                 </>
                )}
            </DialogContent>
        </Dialog>

      <footer className="text-center text-muted-foreground text-xs mt-8 py-4 border-t border-border">
        Wallpapers provided by <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">Pexels</a>.
        App by Firebase Studio.
      </footer>
    </div>
  );
}
