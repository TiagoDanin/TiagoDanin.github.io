import Link from "next/link";
import { Trans, useLingui } from "@lingui/react/macro";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Video, Text } from "lucide-react";
import { formatDate, getRandomColorWithDarkMode, titleToSlug } from '@/utils/parse';
import { DEFAULT_LOCALE, entryPath, intlLocale, localePath, type Locale } from '@/lib/i18n/locales';

interface ArticleCardProps {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    originalUrl: string;
    tags: string[];
    cover: string;
  };
  /** Locale of the page rendering the card, not the content language. */
  locale?: Locale;
  /**
   * Where the tag badges link, without the locale prefix.
   *
   * The blog passes `/blog/tags` so a tag clicked from a list of articles opens
   * the blog's own filter, which lists articles only. Everywhere else the badges
   * point at `/tags`, the site-wide index that also carries talks, projects and
   * milestones. Only pass `/blog/tags` from a page that hides `Video` posts:
   * those tags exist in the site-wide index and not in the blog one.
   */
  tagBasePath?: string;
}

export function ArticleCard({ post, locale = DEFAULT_LOCALE, tagBasePath = '/tags' }: ArticleCardProps) {
  // Everything visible comes from the catalog now. The hand-rolled pt/en
  // ternaries this replaced also built the old trailing-segment URL, which is a
  // redirect page since posts moved under the locale prefix.
  const { t, i18n } = useLingui();
  const postUrl = entryPath(locale, 'post', post.slug);
  const ariaLabel = t`Read ${post.title}`;
  const isVideo = post.originalUrl.includes("youtube.com");

  return (
    <article className="group relative flex flex-col items-start cursor-pointer">
      <Link href={postUrl} className="absolute -inset-x-4 -inset-y-6 sm:-inset-x-6" aria-label={ariaLabel} />
      <div className="absolute -inset-x-4 -inset-y-6 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl pointer-events-none" />

      {post.cover && (
        <div className="relative pointer-events-none w-full mb-4">
          <Image
            src={post.cover}
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
          {formatDate(post.date, intlLocale(i18n.locale))}
        </time>
        {isVideo ? (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            Video
          </Badge>
        ) : (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Text className="h-3 w-3" />
            <Trans>Article</Trans>
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
          <Link key={tag} href={localePath(locale, `${tagBasePath}/${titleToSlug(tag)}`)}>
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
        <Trans>Read article</Trans>
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
          <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </article>
  );
}
