import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { Badge } from "@/components/ui/badge";
import { Video, Text } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toISODate, getRandomColorWithDarkMode, titleToSlug } from '@/utils/parse';

export function generateMetadata() {
  const posts = queryCollection('posts').where({ lang: 'pt' });

  return {
    title: "Blog: Artigos sobre Desenvolvimento & IA",
    description: "Blog sobre desenvolvimento de software, mobile, IA e seguranca. Artigos sobre Flutter, React Native, agentes IA e tecnologia.",
    keywords: ["blog", "desenvolvimento de software", "mobile", "Flutter", "React Native", "IA", "seguranca", "programacao", "artigos tecnicos"],
    alternates: {
      canonical: 'https://tiagodanin.com/blog/pt',
    },
    openGraph: {
      title: "Blog: Desenvolvimento, Mobile & IA",
      description: "Artigos sobre desenvolvimento de software, apps mobile, agentes IA e seguranca.",
      url: "https://tiagodanin.com/blog/pt",
      type: "website",
      siteName: "Tiago Danin",
      locale: "pt_BR",
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Blog: Artigos sobre Desenvolvimento & IA",
          "description": "Blog sobre desenvolvimento de software, mobile, IA e seguranca",
          "url": "https://tiagodanin.com/blog/pt",
          "inLanguage": "pt-BR",
          "author": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": "https://tiagodanin.com"
          },
          "blogPost": posts.map((post) => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.description,
            "datePublished": toISODate(post.date),
            "url": `https://tiagodanin.com/post/${post.slug}/pt`,
            "inLanguage": "pt-BR",
            "isAccessibleForFree": true,
            "author": {
              "@type": "Person",
              "name": "Tiago Danin"
            }
          }))
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://tiagodanin.com/blog" },
            { "@type": "ListItem", "position": 3, "name": "PT", "item": "https://tiagodanin.com/blog/pt" }
          ]
        }
      ])
    }
  };
}

const BlogPt = () => {
  const posts = queryCollection('posts').where({ lang: 'pt' });

  const isYouTubePost = (url: string) => url.includes("youtube.com");

  return (
    <div className="container mx-auto py-32">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-muted-foreground">
          Pensamentos, insights e ideias sobre tecnologia e desenvolvimento
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {posts.length} artigos
        </p>
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog">EN</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-16">
        {posts.map((post, index) => (
          <article key={index} className="group relative flex flex-col items-start cursor-pointer">
            <Link href={`/post/${post.slug}/pt`} className="absolute -inset-x-4 -inset-y-6 sm:-inset-x-6" aria-label={`Ler ${post.title}`} />
            <div className="absolute -inset-x-4 -inset-y-6 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl pointer-events-none" />

            <div className="relative pointer-events-none order-first mb-3 flex items-center gap-2">
              <time className="flex items-center text-sm text-zinc-400 pl-3.5">
                <span className="absolute inset-y-0 left-0 flex items-center">
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                </span>
                {post.date}
              </time>
              {isYouTubePost(post.originalUrl) ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  Video
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Text className="h-3 w-3" />
                  Artigo
                </Badge>
              )}
            </div>

            <h2 className="relative pointer-events-none text-base font-semibold tracking-tight">
              {post.title}
            </h2>

            <p className="relative pointer-events-none mt-2 text-sm text-zinc-600">
              {post.description}
            </p>

            <div className="relative z-10 mt-3 flex flex-wrap gap-2 pointer-events-auto">
              {((post.tags as string[]) || []).map((tag: string) => (
                <Link key={tag} href={`/blog/tags/${titleToSlug(tag)}`}>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getRandomColorWithDarkMode(tag)}`}
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>

            <div className="relative pointer-events-none mt-4 flex items-center text-sm font-medium text-primary">
              Ler artigo
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogPt;
