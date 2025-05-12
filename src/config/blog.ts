
import type { ComponentType } from 'react';

export interface BlogPostMeta {
  slug: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  author?: string;
  tags?: string[];
  keywords?: string[];
  // A function that returns a Promise resolving to the default export of the content module
  contentComponent: () => Promise<{ default: ComponentType<any> }>;
  opengraphImage?: string; // Relative path to image in /public, e.g. /blog/og-image.png
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'wallpaper-trends-2025',
    title: 'Wallpaper Trends for 2025: What’s Hot in Digital Decor',
    summary: 'Explore the upcoming wallpaper trends for 2025. From biophilic designs to AI-generated art, discover what will adorn our screens.',
    date: '2024-05-15',
    author: 'Wallify Editors',
    tags: ['trends', '2025', 'design', 'minimalist', 'maximalist', 'nature', 'abstract'],
    keywords: ['wallpaper trends 2025', 'digital decor', 'desktop backgrounds 2025', 'smartphone wallpapers 2025', 'design predictions', 'popular wallpaper styles'],
    contentComponent: () => import('@/components/blog/articles/wallpaper-trends-2025'),
    opengraphImage: '/blog/og-wallpaper-trends.png',
  },
  {
    slug: 'best-wallpapers-smartphones',
    title: 'Best Wallpapers for Your Smartphone: Stunning Visuals on The Go',
    summary: 'Curated collection of wallpapers optimized for smartphone screens. Find the perfect fit for your iPhone or Android device.',
    date: '2024-05-10',
    author: 'Wallify Curators',
    tags: ['smartphones', 'mobile', 'iphone', 'android', 'optimized'],
    keywords: ['best smartphone wallpapers', 'iPhone wallpapers', 'Android backgrounds', 'mobile wallpapers', 'optimized for phone', 'high-resolution mobile'],
    contentComponent: () => import('@/components/blog/articles/best-wallpapers-smartphones'),
    opengraphImage: '/blog/og-best-phone-wallpapers.png',
  },
  {
    slug: 'wallpapers-for-gamers',
    title: 'Ultimate Wallpaper Collection for Gamers',
    summary: 'Level up your desktop with these epic gaming wallpapers. From fantasy landscapes to futuristic scenes, find your perfect gaming backdrop.',
    date: '2024-05-05',
    author: 'Gamer Central',
    tags: ['gaming', 'gamers', 'desktop', 'fantasy', 'sci-fi'],
    keywords: ['gaming wallpapers', 'wallpapers for gamers', 'desktop gaming backgrounds', 'epic game art', 'video game wallpapers', 'esports wallpapers'],
    contentComponent: () => import('@/components/blog/articles/wallpapers-for-gamers'),
    opengraphImage: '/blog/og-gaming-wallpapers.png',
  },
  {
    slug: 'choosing-perfect-wallpaper',
    title: 'How to Choose the Perfect Wallpaper for Your Aesthetic',
    summary: 'A guide to selecting wallpapers that complement your personal style, color preferences, and the mood you want to create.',
    date: '2024-04-28',
    author: 'Design Gurus',
    tags: ['guide', 'how-to', 'aesthetic', 'personalization', 'style'],
    keywords: ['choose wallpaper', 'perfect wallpaper guide', 'wallpaper aesthetic', 'style matching wallpaper', 'color psychology wallpaper', 'desktop personalization'],
    contentComponent: () => import('@/components/blog/articles/choosing-perfect-wallpaper'),
    opengraphImage: '/blog/og-choosing-wallpaper.png',
  },
  {
    slug: 'wallpaper-color-psychology',
    title: 'Wallpaper Color Palettes to Refresh Your Mood',
    summary: 'Discover how different color palettes in wallpapers can influence your mood and productivity. Choose colors that resonate with you.',
    date: '2024-04-20',
    author: 'Color Experts',
    tags: ['color psychology', 'mood', 'well-being', 'design', 'productivity'],
    keywords: ['wallpaper color psychology', 'mood enhancing wallpapers', 'color palettes for desktop', 'calming wallpapers', 'energetic wallpapers', 'wallpaper and emotion'],
    contentComponent: () => import('@/components/blog/articles/wallpaper-color-psychology'),
    opengraphImage: '/blog/og-wallpaper-colors.png',
  }
];
