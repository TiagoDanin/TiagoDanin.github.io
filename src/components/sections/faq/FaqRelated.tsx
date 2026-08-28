import Link from 'next/link';
import { Trans } from '@lingui/react/macro';
import { ArrowRight } from 'lucide-react';

import type { FaqEntry } from '@/lib/faq';
import { localePath, type Locale } from '@/lib/i18n/locales';

interface FaqRelatedProps {
  entries: FaqEntry[];
  locale: Locale;
}

export function FaqRelated({ entries, locale }: FaqRelatedProps) {
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="faq-related" className="space-y-4">
      <h2 id="faq-related" className="text-xl font-semibold">
        <Trans>Related questions</Trans>
      </h2>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={localePath(locale, `/faq/${entry.slug}`)}
              className="group flex items-start gap-2 text-foreground hover:underline underline-offset-4"
            >
              <ArrowRight className="h-4 w-4 mt-1 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              <span>{entry.question}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
