import Link from 'next/link';
import { Trans } from '@lingui/react/macro';

import type { FaqEntry } from '@/lib/faq';
import { groupFaqByCategory } from '@/lib/faq';
import { localePath, type Locale } from '@/lib/i18n/locales';

interface FaqIndexProps {
  entries: FaqEntry[];
  locale: Locale;
}

/**
 * The index: every question with its answer already visible.
 *
 * The answers are inline rather than hidden behind a link or an accordion. A
 * page that only lists questions makes the reader click to learn anything, and
 * gives an answer engine nothing to extract from the page it is most likely to
 * fetch first. The link to the detail page is an offer of more, not the only way
 * to get an answer.
 *
 * Each entry carries an `id` so the questions with no page of their own are
 * still addressable, as `/faq/#slug`.
 */
export function FaqIndex({ entries, locale }: FaqIndexProps) {
  const groups = groupFaqByCategory(entries);

  return (
    <div className="space-y-16">
      {groups.map((group) => (
        <section key={group.category} aria-labelledby={`faq-cat-${group.category}`} className="space-y-8">
          <h2 id={`faq-cat-${group.category}`} className="text-2xl font-bold tracking-tight">
            {group.category}
          </h2>

          <div className="space-y-8">
            {group.entries.map((entry) => {
              const hasPage = (entry.body ?? '').trim().length > 0;

              return (
                <article key={entry.slug} id={entry.slug} className="space-y-2 scroll-mt-24">
                  <h3 className="text-lg font-semibold text-foreground">{entry.question}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">{entry.answer}</p>
                  {hasPage && (
                    <p>
                      <Link
                        href={localePath(locale, `/faq/${entry.slug}`)}
                        className="text-sm font-medium text-primary hover:underline underline-offset-4"
                      >
                        <Trans>Read the full answer</Trans>
                      </Link>
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
