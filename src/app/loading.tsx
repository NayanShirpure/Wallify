
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // This global loading skeleton aims to represent the common structure of main pages.
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <Skeleton className="h-8 w-24" /> {/* Logo/Site Name */}
          <div className="flex gap-2 items-center w-full sm:w-auto sm:flex-grow max-w-xs sm:max-w-sm md:max-w-md">
            <Skeleton className="h-8 w-full rounded-full" /> {/* Search Input */}
            <Skeleton className="h-8 w-8 rounded-full shrink-0" /> {/* Search Button */}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-md" /> {/* Device Tabs */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Categories Menu */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Theme Toggle */}
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-7xl p-4 md:p-6 space-y-6 sm:space-y-8">
        {/* Page Title Skeleton */}
        <Skeleton className="h-10 w-1/2 mx-auto" />
        
        {/* Featured Item Skeleton (e.g., Wallpaper of the Day) */}
        <Skeleton className="w-full aspect-video rounded-xl max-h-[350px] sm:max-h-[400px]" />

        {/* Section Title Skeleton */}
        <Skeleton className="h-8 w-1/3 mt-4" />
        
        {/* Grid of items Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(10)].map((_, i) => ( // Reduced from 15 to 10 items
            <Skeleton key={`loading-page-grid-skeleton-${i}`} className="aspect-[9/16] sm:aspect-video w-full rounded-lg" />
          ))}
        </div>
      </main>

      <footer className="text-center text-muted-foreground text-xs mt-auto py-3 sm:py-4 border-t border-border bg-background/50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4">
          <Skeleton className="h-4 w-full sm:w-1/3" /> {/* Credits/Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-x-3 sm:gap-x-4">
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Social Icon */}
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Social Icon */}
              <Skeleton className="h-4 w-4 rounded-full" /> {/* Social Icon */}
            </div>
            <div className="flex gap-x-3 sm:gap-x-4 flex-wrap justify-center">
              <Skeleton className="h-4 w-10" /> {/* Nav Link */}
              <Skeleton className="h-4 w-10" /> {/* Nav Link */}
              <Skeleton className="h-4 w-10" /> {/* Nav Link */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
