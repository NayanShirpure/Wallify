'use client';

import React, { useState, useEffect } from 'react';
import type { PexelsPhoto } from '@/types/pexels';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Added DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Download, ExternalLink, User, Image as ImageIcon, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadFile } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PreviewDialogProps {
  photo: PexelsPhoto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewDialog({ photo, isOpen, onClose }: PreviewDialogProps) {
  const [selectedDownloadUrl, setSelectedDownloadUrl] = useState<string>('');
  const [selectedResolutionLabel, setSelectedResolutionLabel] = useState<string>('Original');
  const { toast } = useToast();

  useEffect(() => {
    if (photo) {
      setSelectedDownloadUrl(photo.src.original);
      setSelectedResolutionLabel('Original'); // Reset to original on new photo
    } else {
      setSelectedDownloadUrl('');
      setSelectedResolutionLabel('Original');
    }
  }, [photo]);

  if (!photo) return null;

  const downloadOptions = [
    { label: 'Original', url: photo.src.original, resolution: `${photo.width}x${photo.height}` },
    { label: 'Large (2x)', url: photo.src.large2x, resolution: 'Approx 1920px wide' }, // Typical large2x width
    { label: 'Large', url: photo.src.large, resolution: 'Approx 1280px wide' },
    { label: 'Medium', url: photo.src.medium, resolution: 'Approx 640px wide' },
    { label: 'Small', url: photo.src.small, resolution: 'Approx 320px wide' },
    { label: 'Portrait Optimized', url: photo.src.portrait, resolution: 'Optimized for Portrait' },
    { label: 'Landscape Optimized', url: photo.src.landscape, resolution: 'Optimized for Landscape' },
  ].filter(opt => opt.url); // Filter out options where URL might be missing

  const handleDownload = async () => {
    if (!selectedDownloadUrl || !photo) return;

    const photographerName = photo.photographer.replace(/[^a-zA-Z0-9_-\s]/g, '').replace(/\s+/g, '_');
    // Extract a simpler label for filename, e.g., "Original", "Large2x"
    const simpleResLabel = selectedResolutionLabel.split(' ')[0].replace('(','').replace(')','');
    const filename = `wallify_${photographerName}_${photo.id}_${simpleResLabel}.jpg`;

    toast({
      title: "Download Starting",
      description: `Preparing ${filename} for download...`,
    });
    try {
      await downloadFile(selectedDownloadUrl, filename);
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
  
  const handleSelectChange = (value: string) => {
    const selectedOpt = downloadOptions.find(opt => opt.url === value);
    if (selectedOpt) {
        setSelectedDownloadUrl(selectedOpt.url);
        setSelectedResolutionLabel(selectedOpt.label);
    }
  };

  // Determine the aspect ratio for the modal image based on the photo's dimensions
  const modalImageAspectRatio = photo.width / photo.height > 1.2 
    ? 'aspect-video' // Landscape-ish
    : photo.height / photo.width > 1.2
    ? 'aspect-[9/16]' // Portrait-ish
    : 'aspect-square'; // Close to square or fallback

  const displayAlt = (photo.alt && photo.alt.trim() !== '') ? photo.alt : 'Wallpaper Preview';
  const imageAlt = (photo.alt && photo.alt.trim() !== '') ? photo.alt : 'Wallpaper preview';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-full h-auto max-h-[90vh] flex flex-col p-0 border-none !rounded-xl overflow-hidden shadow-2xl bg-card/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <DialogHeader className="relative p-3 sm:p-4 flex flex-row justify-between items-start bg-gradient-to-b from-black/50 to-transparent z-10">
           <div className="flex flex-col mr-4 overflow-hidden">
            <DialogTitle className="text-sm sm:text-base font-semibold text-white truncate">{displayAlt}</DialogTitle>
            <DialogDescription className="text-xs text-gray-300">
                Photo by <a href={photo.photographer_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent focus:outline-none focus:ring-1 focus:ring-accent rounded">{photo.photographer}</a>
                <span className="mx-1.5">·</span>
                {photo.width}x{photo.height}
            </DialogDescription>
           </div>
           <DialogClose
              onClick={onClose}
              className="text-white bg-black/30 rounded-full p-1 sm:p-1.5 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/30 transition-colors shrink-0"
              aria-label="Close preview"
            >
              <X size={16} className="sm:size-[18px]" />
            </DialogClose>
        </DialogHeader>
        
        <div className={`relative w-full ${modalImageAspectRatio} flex-grow bg-black/50 flex items-center justify-center overflow-hidden`}>
          <Image
            src={photo.src.large2x || photo.src.original} // Use a high-quality source for preview
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 90vw, 70vw"
            className="object-contain"
            priority
            placeholder="blur"
            blurDataURL={photo.src.tiny}
            data-ai-hint={photo.alt ? photo.alt.split(' ').slice(0,2).join(' ') : "wallpaper image"}
          />
        </div>

        <DialogFooter className="relative p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 bg-gradient-to-t from-black/50 to-transparent z-10">
          <Button variant="outline" size="sm" asChild className="bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm text-xs sm:text-sm">
            <a href={photo.url} target="_blank" rel="noopener noreferrer">
              View on Pexels <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </a>
          </Button>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Select value={selectedDownloadUrl} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full sm:min-w-[180px] sm:w-auto h-9 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border-white/30 text-white focus:ring-accent focus:ring-offset-black/30 focus:border-accent backdrop-blur-sm">
                <SelectValue placeholder="Select resolution" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border text-foreground">
                {downloadOptions.map(opt => (
                  <SelectItem key={opt.label} value={opt.url} disabled={!opt.url} className="text-xs sm:text-sm">
                    {opt.label} ({opt.resolution})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
                onClick={handleDownload} 
                className="h-9 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md text-xs sm:text-sm" 
                disabled={!selectedDownloadUrl}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" /> Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}