import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Video, Text } from "lucide-react";
import { formatDate, getRandomColorWithDarkMode, titleToSlug } from '@/utils/parse';

interface ArticleCardProps {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    originalUrl: string;
    tags: string[];
  };
  locale?: 'en' | 'pt';
  coverImage: string | null;
}

export function ArticleCard({ post, locale = 'en', coverImage }: ArticleCardProps) {
  const postUrl = locale === 'pt' ? `/post/${post.slug}/pt` : `/post/${post.slug}`;
  const ariaLabel = locale === 'pt' ? `Ler ${post.title}` : `Read ${post.title}`;
  const readLabel = locale === 'pt' ? 'Ler artigo' : 'Read article';
  const isVideo = post.originalUrl.includes("youtube.com");

  return (
    <article className="group relative flex flex-col items-start cursor-pointer">
      <Link href={postUrl} className="absolute -inset-x-4 -inset-y-6 sm:-inset-x-6" aria-label={ariaLabel} />
      <div className="absolute -inset-x-4 -inset-y-6 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl pointer-events-none" />

      {coverImage && (
        <div className="relative pointer-events-none w-full mb-4">
          <Image
            src={coverImage}
            alt={post.title}
            width={672}
            height={378}
            className="w-full h-auto rounded-xl object-cover"
          />
        </div>
      )}

      <div className="relative pointer-events-none order-first mb-3 flex items-center gap-2">
        <time className="flex items-center text-sm text-zinc-400 pl-3.5">
          <span className="absolute inset-y-0 left-0 flex items-center">
            <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
          </span>
          {formatDate(post.date)}
        </time>
        {isVideo ? (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            Video
          </Badge>
        ) : (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Text className="h-3 w-3" />
            {locale === 'pt' ? 'Artigo' : 'Article'}
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
        {(post.tags || []).map((tag: string) => (
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
        {readLabel}
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
          <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </article>
  );
}
