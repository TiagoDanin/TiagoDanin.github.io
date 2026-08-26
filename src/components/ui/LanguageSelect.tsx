'use client';

import { Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLingui } from '@lingui/react/macro';

import { HTML_LANG, LOCALES, switchLocalePath, type Locale } from '@/lib/i18n/locales';
import { cn } from '@/lib/utils';

export interface LanguageSelectProps {
  /** Language the page is currently rendered in. */
  current: Locale;
  /**
   * Route to resolve counterparts from. Defaults to the live pathname, which is
   * what the site wants; a story passes one so it can render without a router.
   */
  pathname?: string;
  className?: string;
}

/** Endonyms: a reader looking for their language reads it in that language. */
const LABELS: Record<Locale, string> = {
  en: 'English',
  br: 'Português',
};

/**
 * Language switcher, sitting on the footer's link row.
 *
 * Two links rather than a select. A dropdown holding two options hides the
 * alternative behind a click and puts a bordered form control in a row of plain
 * text, and neither is worth it until there are enough languages that showing
 * them all stops fitting.
 *
 * A language with no version of the current page is shown inert instead of
 * hidden. Half the routes are still English-only, and saying so is more useful
 * than a link that quietly lands the reader somewhere else.
 */
export function LanguageSelect({ current, pathname, className }: LanguageSelectProps) {
  const livePathname = usePathname();
  const { t } = useLingui();

  const path = pathname ?? livePathname ?? '/';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <ul aria-label={t`Language`} className="flex items-center gap-1">
        {LOCALES.map((locale) => {
          const label = LABELS[locale];
          const target = locale === current ? null : switchLocalePath(path, locale);
          const base = 'flex min-h-[44px] items-center rounded-md px-2 text-sm transition-colors';

          if (locale === current) {
            return (
              <li key={locale}>
                <span
                  aria-current="true"
                  lang={HTML_LANG[locale]}
                  className={cn(base, 'font-medium text-foreground')}
                >
                  {label}
                </span>
              </li>
            );
          }

          if (!target) {
            return (
              <li key={locale}>
                <span
                  aria-disabled="true"
                  lang={HTML_LANG[locale]}
                  className={cn(base, 'text-muted-foreground/50')}
                >
                  {label}
                  {/* The row gives no other clue why this one is not a link. */}
                  <span className="sr-only">
                    {' '}
                    <>{t`This page has no version in this language yet`}</>
                  </span>
                </span>
              </li>
            );
          }

          return (
            <li key={locale}>
              <Link
                href={target}
                hrefLang={HTML_LANG[locale]}
                lang={HTML_LANG[locale]}
                className={cn(
                  base,
                  'text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
