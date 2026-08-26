import type { Metadata } from 'next';
import { queryCollection } from 'nextjs-studio/server';

import { LegacyRedirect } from '@/components/layout/LegacyRedirect';
import { ORIGIN } from '@/lib/i18n/seo';

/**
 * `/post/[slug]/pt/` moved to `/br/post/[slug]/`.
 *
 * Kept only so the indexed address keeps resolving. Delete with the rest of
 * `(legacy)` once the old URLs have dropped out of the index.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return queryCollection('posts')
    .where({ lang: 'pt' })
    .map((post: { slug: string }) => ({ slug: post.slug }));
}

function target(slug: string) {
  return `/br/post/${slug}/`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: 'Redirecting', alternates: { canonical: `${ORIGIN}${target(slug)}` } };
}

export default async function LegacyPostPt({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LegacyRedirect to={target(slug)} />;
}
