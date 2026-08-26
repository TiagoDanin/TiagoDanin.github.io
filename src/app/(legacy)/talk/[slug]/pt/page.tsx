import type { Metadata } from 'next';
import { queryCollection } from 'nextjs-studio/server';

import { LegacyRedirect } from '@/components/layout/LegacyRedirect';
import { ORIGIN } from '@/lib/i18n/seo';

/**
 * `/talk/[slug]/pt/` moved to `/br/talk/[slug]/`. See the post equivalent.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return queryCollection('talks')
    .where({ lang: 'pt' })
    .map((talk: { slug: string }) => ({ slug: talk.slug }));
}

function target(slug: string) {
  return `/br/talk/${slug}/`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: 'Redirecting', alternates: { canonical: `${ORIGIN}${target(slug)}` } };
}

export default async function LegacyTalkPt({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRedirect to={target(slug)} />;
}
