
import { blogPosts } from '@/config/blog';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, UserCircle } from 'lucide-react';
import { StructuredData } from '@/components/structured-data';
// Updated import for local minimal types
import type { 
  BlogPosting, 
  Person, 
  Organization, 
  ImageObject as SchemaImageObject, // Renamed to avoid conflict
  WebPage as SchemaWebPage, // Renamed to avoid conflict
  MinimalWithContext 
} from '@/types/schema-dts';
import Image from 'next/image';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

interface BlogPostPageProps {
  params: { slug: string };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const PostContent = (await post.contentComponent()).default;

  const allTagsAndKeywords = [
    ...(post.keywords || []),
    ...(post.tags || [])
  ];
  const uniqueKeywords = Array.from(new Set(allTagsAndKeywords));
  const keywordsString = uniqueKeywords.length > 0 ? uniqueKeywords.join(', ') : undefined;

  // Correctly typed with MinimalWithContext<BlogPosting>
  const articleSchema: MinimalWithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.opengraphImage
      ? `${BASE_URL}${post.opengraphImage.replace(/^\//, '')}`
      : `${BASE_URL}blog/og-blog-main.png`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'Wallify Team',
    } as Person, // Cast to ensure it matches the defined Person type
    publisher: {
      '@type': 'Organization',
      name: 'Wallify',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}opengraph-image.png`,
      } as SchemaImageObject, // Cast to ensure it matches the defined ImageObject type
    } as Organization, // Cast to ensure it matches the defined Organization type
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}blog/${post.slug}`,
    } as SchemaWebPage, // Cast to ensure it matches the defined WebPage type
    keywords: keywordsString,
  };

  return (
    <>
      <StructuredData data={articleSchema} />
      <article className="w-full">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-3">{post.title}</h1>
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {post.author && (
              <div className="flex items-center">
                <UserCircle className="h-4 w-4 mr-1.5" />
                By {post.author}
              </div>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {post.opengraphImage && (
          <div className="relative aspect-video w-full max-w-3xl mx-auto rounded-lg overflow-hidden mb-8 shadow-lg">
            <Image
              src={post.opengraphImage}
              alt={`Cover image for ${post.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 768px, 1000px"
              className="object-cover"
              priority
              data-ai-hint="blog cover"
            />
          </div>
        )}

        <div className="prose prose-invert max-w-none dark:prose-invert 
                        prose-headings:text-primary prose-headings:font-semibold 
                        prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-md prose-img:shadow-md
                        prose-p:text-foreground/90 prose-li:text-foreground/90
                        prose-strong:text-primary
                        prose-code:bg-muted prose-code:text-accent prose-code:p-1 prose-code:rounded-sm prose-code:text-sm
                        prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground">
          <PostContent />
        </div>
      </article>
    </>
  );
}
