// src/app/blog/[slug]/layout.tsx

import type { Metadata, ResolvingMetadata } from 'next';
import type { ReactNode } from 'react'; // Explicitly import ReactNode
import { blogPosts } from '@/config/blog';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

// Async metadata generator
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found | Wallify',
      description: 'The blog post you are looking for does not exist.',
      alternates: {
        canonical: `${BASE_URL}blog/${slug}`,
      },
    };
  }

  // Resolve parent metadata once
  const parentOpenGraph = await parent;
  const previousImages = parentOpenGraph?.openGraph?.images || [];

  const ogImage = post.opengraphImage
    ? `${BASE_URL}${post.opengraphImage.replace(/^\//, '')}`
    : `${BASE_URL}blog/og-blog-main.png`; // Default OG image

  return {
    title: post.title,
    description: post.summary,
    keywords: post.keywords || post.tags,
    alternates: {
      canonical: `${BASE_URL}blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: `${BASE_URL}blog/${slug}`,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : ['Wallify Team'],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
        ...previousImages,
      ],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [ogImage],
    },
  };
}

// Synchronous layout component with typed props
export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}