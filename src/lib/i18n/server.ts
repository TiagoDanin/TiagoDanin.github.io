import { setupI18n, type I18n } from '@lingui/core';
import { getI18n, setI18n } from '@lingui/react/server';

import { messages as en } from '@/locales/en/messages';
import { messages as br } from '@/locales/br/messages';
import { DEFAULT_LOCALE, isLocale, type Locale } from './locales';

/**
 * Server-side Lingui wiring.
 *
 * The catalogs are the compiled output of `yarn i18n:compile`, keyed by the
 * hash the SWC macro plugin emits, not by the English source. Editing a `.po`
 * without recompiling leaves the site rendering the old text.
 *
 * Server-only: `setI18n` writes into React's per-request cache. A client
 * component reads its strings from `LinguiClientProvider` instead.
 */
const catalogs: Record<Locale, typeof en> = { en, br };

const instances = new Map<Locale, I18n>();

export function getI18nInstance(locale: Locale): I18n {
  const cached = instances.get(locale);
  if (cached) return cached;

  const i18n = setupI18n({ locale, messages: { [locale]: catalogs[locale] } });
  instances.set(locale, i18n);
  return i18n;
}

/**
 * Publishes the instance for this render. The App Router gives every layout and
 * page its own cache scope, so this has to run in each one, not only the root.
 */
export function initI18n(locale: Locale): I18n {
  const i18n = getI18nInstance(locale);
  setI18n(i18n);
  return i18n;
}

/** Narrows a raw route param. Falls back rather than 404s: the param comes from `generateStaticParams`, so an unknown value means a bug, not a bad URL. */
export function resolveLocale(value: string): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * The instance for this render, creating a default-locale one if none exists.
 *
 * `not-found.tsx` receives no params, so it cannot resolve a locale, and Next
 * renders it in a scope where the layout's `initI18n` has not necessarily run.
 * A `<Trans>` there would otherwise throw during export, which is how it was
 * found: the build failed on a project slug that hits `notFound()`.
 *
 * English is the honest fallback. A 404 body is chrome, and getting it in the
 * wrong language is better than failing the build.
 */
export function ensureI18n(): I18n {
  return getI18n() ?? initI18n(DEFAULT_LOCALE);
}
