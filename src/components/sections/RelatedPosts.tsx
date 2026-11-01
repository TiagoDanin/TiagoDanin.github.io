import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { formatDate } from "@/utils/parse";
import { entryPath, intlLocale, type Locale } from "@/lib/i18n/locales";

interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  /** Locale of the page, which is also the language of the posts listed. */
  locale: Locale;
}

/**
 * The end of a post, before the comments: up to three posts sharing its tags
 * (`relatedPosts()` in `src/lib/mdx.ts`). Clarity showed 88% of the sessions
 * that enter on a post leaving after it, with nothing past the text but the
 * comments to go to.
 */
export function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts" className="mt-12 border-t border-border pt-8">
      <h2 id="related-posts" className="text-xl font-semibold tracking-tight">
        <Trans>Keep reading</Trans>
      </h2>
      <ul className="mt-6 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={entryPath(locale, "post", post.slug)} className="group block rounded-md">
              <time className="text-sm text-muted-foreground">{formatDate(post.date, intlLocale(locale))}</time>
              <p className="mt-1 font-semibold group-hover:text-primary transition-colors">{post.title}</p>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
