import type { Metadata } from 'next';
import Link from 'next/link';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';

import { LegalDocument } from '@/components/sections/LegalDocument';
import { Button } from '@/components/ui/button';
import { formatLegalDate, getLegalDoc } from '@/lib/legal';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { renderMdx } from '@/lib/render-mdx';
import {
  localeAlternates,
  openGraphDefaults,
  pageUrl,
  twitterDefaults,
} from '@/lib/i18n/seo';

const SLUGS = ['privacy', 'terms'] as const;

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/legal'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  const title = t(i18n)`Privacy and terms of use`;
  const description = t(
    i18n
  )`What this site collects, how to stop it, and what you may do with the code and the writing published here.`;

  return {
    title,
    description,
    alternates: localeAlternates(locale, '/legal'),
    openGraph: {
      title: `${title} | Tiago Danin`,
      description,
      url: pageUrl(locale, '/legal'),
      type: 'website',
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: `${title} | Tiago Danin`,
      description,
    },
  };
}

export default async function LegalPage({ params }: PageProps<'/[lang]/legal'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  // Rendered here rather than in the component: renderMdx compiles on the
  // server, and LegalDocument stays a plain shell any story can mount.
  const docs = await Promise.all(
    SLUGS.map(async (slug) => {
      const doc = getLegalDoc(slug, locale);
      if (!doc) return null;
      return { ...doc, content: await renderMdx(doc.body) };
    })
  );
  const documents = docs.filter((doc) => doc !== null);

  const updatedLabel = t(i18n)`Last updated`;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden px-4 pb-14 pt-16 md:pb-16 md:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-120 w-120 rounded-full bg-blue-100 opacity-50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-44 top-10 h-120 w-120 rounded-full bg-green-100 opacity-40 blur-3xl"
        />

        <div className="container relative z-10 mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            <Trans>Privacy and terms of use</Trans>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            <Trans>
              Two short documents. The first one covers what the site can see
              about you and how to stop it. The second one covers what you may
              do with the code and the writing.
            </Trans>
          </p>

          {documents.length > 0 && (
            <nav className="mt-8 flex flex-wrap gap-3" aria-label={t(i18n)`Documents`}>
              {documents.map((doc) => (
                <Button key={doc.slug} variant="outline" asChild>
                  <Link href={`#${doc.slug}`}>{doc.title}</Link>
                </Button>
              ))}
            </nav>
          )}
        </div>
      </section>

      <div className="container mx-auto max-w-2xl space-y-14 px-4 pb-24">
        {documents.map((doc) => (
          <LegalDocument
            key={doc.slug}
            id={doc.slug}
            title={doc.title}
            updatedLabel={updatedLabel}
            updatedAt={formatLegalDate(doc.updatedAt, locale)}
            updatedIso={doc.updatedAt}
          >
            {doc.content}
          </LegalDocument>
        ))}
      </div>
    </div>
  );
}
