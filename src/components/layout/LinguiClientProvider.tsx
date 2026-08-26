'use client';

import { I18nProvider } from '@lingui/react';
import { setupI18n, type Messages } from '@lingui/core';
import { useState } from 'react';

/**
 * Hands the active catalog to the client components below it.
 *
 * Server components read their strings from `initI18n`, which writes into
 * React's per-request cache and never reaches the browser. Anything marked
 * `'use client'` is a separate bundle with its own module state, so it needs
 * the catalog shipped to it. That is what this provider does, and it is why
 * every message a client component renders adds weight to the page.
 */
export function LinguiClientProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Messages;
}) {
  // Built once per mount: re-creating the instance on every render would reset
  // the catalog and remount every consumer.
  const [i18n] = useState(() => setupI18n({ locale, messages: { [locale]: messages } }));

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
