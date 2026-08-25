import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export interface PressMention {
  /** Publication name. */
  outlet: string;
  title: string;
  /** Article URL. Opens in a new tab. */
  url: string;
  /** ISO date, used as the `datetime` value. */
  date: string;
  /** Pre-formatted date for display, e.g. "November 27, 2022". */
  displayDate: string;
}

export interface PressMentionsProps {
  /** Rendered in the order given. The page decides how many to show. */
  items: PressMention[];
  /** Route behind the closing link. */
  href?: string;
}

/**
 * Third-party coverage on /about, as a list of outlet-dated cards.
 *
 * The second of the two blocks that separate /about from the home page. Every
 * entry links off-site, so each card carries an external-link affordance rather
 * than relying on the reader to guess.
 *
 * The date arrives pre-formatted because `pressDate()` is server-side; the
 * component never parses a date string itself.
 */
export function PressMentions({ items, href = "/press" }: PressMentionsProps) {
  if (items.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30" aria-labelledby="press-heading">
      <div className="container mx-auto px-4">
        <h2 id="press-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
          In the press
        </h2>

        <ul className="mt-8 grid gap-6">
          {items.map((item) => (
            <li key={item.url}>
              <article className="rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="font-semibold">{item.outlet}</span>
                  <span aria-hidden="true" className="text-muted-foreground">·</span>
                  <time dateTime={item.date} className="text-sm text-muted-foreground">
                    {item.displayDate}
                  </time>
                </div>

                <h3 className="mt-3 text-lg font-semibold leading-snug">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline hover:text-primary transition-colors"
                  >
                    {item.title}
                    <ExternalLink
                      className="ml-1.5 inline h-4 w-4 align-baseline text-muted-foreground group-hover:text-primary transition-colors"
                      aria-hidden="true"
                    />
                  </a>
                </h3>
              </article>
            </li>
          ))}
        </ul>

        <Link
          href={href}
          className="mt-8 inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4 min-h-[44px]"
        >
          All press mentions
          <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
