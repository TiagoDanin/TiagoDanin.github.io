import type { Metadata } from 'next';

import { LegacyRedirect } from '@/components/layout/LegacyRedirect';
import { ORIGIN } from '@/lib/i18n/seo';

/**
 * `/blog/pt/` moved to `/br/blog/`.
 *
 * Kept only so the indexed address keeps resolving. Delete with the rest of
 * `(legacy)`.
 */
const TARGET = '/br/blog/';

export const metadata: Metadata = {
  title: 'Redirecting',
  alternates: { canonical: `${ORIGIN}${TARGET}` },
};

export default function LegacyblogPt() {
  return <LegacyRedirect to={TARGET} />;
}
