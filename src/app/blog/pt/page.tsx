import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { TagFilter } from "@/components/ui/TagFilter";
import { getCoverImagePath } from "@/lib/cover-image";
import { toISODate } from '@/utils/parse';

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
  const posts = [...queryCollection('posts').where({ lang: 'pt' })].sort((a, b) => b.date.localeCompare(a.date));

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

      <TagFilter posts={posts} />

      <div className="max-w-2xl mx-auto space-y-16">
        {posts.map((post, index) => (
          <ArticleCard
            key={index}
            post={post}
            locale="pt"
            coverImage={getCoverImagePath(post.slug)}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogPt;
