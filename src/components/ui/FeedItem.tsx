import Link from "next/link";

export interface FeedItemProps {
  /** Feed name, e.g. "Blog". */
  title: string;
  /** Absolute feed URL. Shown verbatim and used as the link target. */
  url: string;
  description: string;
}

/**
 * One RSS feed on the /rss index: name, address, and what it carries.
 *
 * The URL is shown in full rather than hidden behind a label, because a feed
 * address is meant to be copied into a reader.
 */
export function FeedItem({ title, url, description }: FeedItemProps) {
  return (
    <div className="p-6 rounded-lg border bg-card shadow-xs flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link
          href={url}
          className="text-primary hover:underline text-sm break-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          {url}
        </Link>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
