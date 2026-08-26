import type { Metadata } from 'next';

import { LegacyRedirect } from '@/components/layout/LegacyRedirect';
import { ORIGIN } from '@/lib/i18n/seo';

/**
 * `/talks/pt/` moved to `/br/talks/`.
 *
 * Kept only so the indexed address keeps resolving. Delete with the rest of
 * `(legacy)`.
 */
const TARGET = '/br/talks/';

export const metadata: Metadata = {
  title: 'Redirecting',
  alternates: { canonical: `${ORIGIN}${TARGET}` },
};

export default function LegacytalksPt() {
  return <LegacyRedirect to={TARGET} />;
}
