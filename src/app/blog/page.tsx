
import Link from 'next/link';
import { blogPosts } from '@/config/blog';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'; // Removed CardTitle
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { CalendarDays, UserCircle } from 'lucide-react';
import { StructuredData } from '@/components/structured-data';
import type { Blog, WithContext } from 'schema-dts';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nayanshirpure.github.io/Wallify/';

export default function BlogIndexPage() {
  const sortedBlogPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const blogSchema: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Wallify Blog',
    description: 'Insights, trends, and guides on digital wallpapers from Wallify.',
    url: `${BASE_URL}blog`,
    blogPost: sortedBlogPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${BASE_URL}blog/${post.slug}`,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author || 'Wallify Team',
      },
      image: post.opengraphImage ? `${BASE_URL}${post.opengraphImage.startsWith('/') ? post.opengraphImage.substring(1) : post.opengraphImage}` : `${BASE_URL}blog/og-blog-main.png`,
      description: post.summary,
      keywords: post.keywords?.join(', ') || post.tags?.join(', '),
    })),
  };


  return (
    <>
      <StructuredData data={blogSchema} />
      <div className="space-y-8">
        {sortedBlogPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} passHref legacyBehavior>
            <a className="block group">
              <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out overflow-hidden">
                <div className="md:flex">
                  {post.opengraphImage && (
                     <div className="md:w-1/3 relative aspect-video md:aspect-auto overflow-hidden">
                       <Image
                          src={post.opengraphImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                          data-ai-hint="blog article theme"
                       />
                     </div>
                  )}
                  <div className={`p-5 sm:p-6 ${post.opengraphImage ? 'md:w-2/3' : 'w-full'}`}>
                    <CardHeader className="p-0 mb-2">
                      <h2 className="text-xl sm:text-2xl font-semibold leading-none tracking-tight text-card-foreground group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CardDescription className="text-muted-foreground mb-3 text-sm sm:text-base leading-relaxed">
                        {post.summary}
                      </CardDescription>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        {post.author && (
                          <div className="flex items-center">
                            <UserCircle className="h-3.5 w-3.5 mr-1.5" />
                            {post.author}
                          </div>
                        )}
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </>
  );
}

    