import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export interface MilestoneEntry {
  /** Year, as stored in the timeline collection. Used as the `datetime` value. */
  date: string;
  title: string;
  description: string;
  tags?: string[];
}

export interface MilestonesProps {
  /** Rendered in the order given. The page decides how many to show. */
  milestones: MilestoneEntry[];
  /** Route behind the closing link. */
  href?: string;
}

/**
 * Career highlights on /about, as an ordered list of dated cards.
 *
 * This is one of the two blocks that separate /about from the home page: the
 * home sells what he builds, /about backs it with a record. Only the first two
 * tags of an entry are shown, so a heavily tagged milestone cannot push the
 * heading out of view.
 */
export function Milestones({ milestones, href = "/timeline" }: MilestonesProps) {
  // Nothing rather than a heading over a blank list. PressMentions matches.
  if (milestones.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden" aria-labelledby="milestones-heading">
      {/* Brand orbs: green at the left edge, purple at the right. */}
      <div className="absolute -left-32 top-1/4 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-30" aria-hidden="true" />
      <div className="absolute -right-32 bottom-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-25" aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        <h2 id="milestones-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
          <Trans>Milestones</Trans>
        </h2>

        <ol className="mt-8 space-y-6">
          {milestones.map((event) => (
            <li
              key={`${event.date}-${event.title}`}
              className="rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <time dateTime={event.date} className="text-sm font-semibold text-muted-foreground">
                  {event.date}
                </time>
                {(event.tags ?? []).slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h3 className="mt-3 text-lg font-semibold leading-snug">{event.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </li>
          ))}
        </ol>

        <Link
          href={href}
          className="mt-8 inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4 min-h-[44px]"
        >
          <Trans>Full timeline</Trans>
          <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
