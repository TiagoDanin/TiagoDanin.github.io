import Link from 'next/link';
import { Trans } from '@lingui/react/macro';

import type { FaqEntry } from '@/lib/faq';
import { groupFaqByCategory } from '@/lib/faq';
import { localePath, type Locale } from '@/lib/i18n/locales';

interface FaqIndexProps {
  entries: FaqEntry[];
  locale: Locale;
}

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
                  <h3 className="text-lg font-semibold text-foreground text-balance break-words">{entry.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{entry.answer}</p>
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
