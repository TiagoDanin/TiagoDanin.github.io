import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { queryCollection } from 'nextjs-studio/server';

import { LegalDocument } from '@/components/sections/LegalDocument';
import { Button } from '@/components/ui/button';
import {
  appLegalHasLocale,
  formatLegalDate,
  getAppLegalApps,
  getAppLegalDoc,
  type AppLegalKind,
} from '@/lib/legal';
import { localePath } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { renderMdx } from '@/lib/render-mdx';
import {
  localeAlternates,
  openGraphDefaults,
  pageUrl,
  twitterDefaults,
} from '@/lib/i18n/seo';

const KINDS: AppLegalKind[] = ['privacy', 'terms'];

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = resolveLocale(params.lang);
  return getAppLegalApps()
    .filter(({ app }) => appLegalHasLocale(app, locale))
    .map(({ app }) => ({ app }));
}

function findApp(app: string) {
  return getAppLegalApps().find((entry) => entry.app === app) ?? null;
}

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/legal/[app]'>): Promise<Metadata> {
  const { lang, app } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const entry = findApp(app);
  if (!entry) return {};

  const appName = entry.appName;
  const title = t(i18n)`${appName}: privacy policy and terms of use`;
  const description = t(
    i18n
  )`What ${appName} collects, which services receive it, how to delete it, and the rules for using the app and its paid features.`;
  const path = `/legal/${app}`;

  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      title: `${title} | Tiago Danin`,
      description,
      url: pageUrl(locale, path),
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

export default async function AppLegalPage({ params }: PageProps<'/[lang]/legal/[app]'>) {
  const { lang, app } = await params;
  const locale = resolveLocale(lang);
  const i18n = initI18n(locale);

  const entry = findApp(app);
  if (!entry) notFound();
  const appName = entry.appName;

  const docs = await Promise.all(
    KINDS.map(async (kind) => {
      const doc = getAppLegalDoc(app, kind, locale);
      if (!doc) return null;
      return { ...doc, content: await renderMdx(doc.body) };
    })
  );
  const documents = docs.filter((doc) => doc !== null);

  // Only apps already on /apps get the way back; an unreleased one has its
  // documents published for the store listing and nothing to link to yet.
  const hasAppPage = queryCollection('googleplay').locale(locale).where({ slug: app }).count() > 0;

  const updatedLabel = t(i18n)`Last updated`;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden px-4 pb-14 pt-16 md:pb-16 md:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 h-120 w-120 rounded-full bg-purple-100 opacity-50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-44 top-10 h-120 w-120 rounded-full bg-yellow-100 opacity-40 blur-3xl"
        />

        <div className="container relative z-10 mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance md:text-5xl">
            <Trans>{appName}: privacy and terms of use</Trans>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            <Trans>
              The privacy policy covers what the app collects, who else receives
              it and how to delete it. The terms of use cover what is free, what
              is paid and what you may do with the app.
            </Trans>
          </p>

          <nav className="mt-8 flex flex-wrap gap-3" aria-label={t(i18n)`Documents`}>
            {documents.map((doc) => (
              <Button key={doc.slug} variant="outline" asChild>
                <Link href={`#${doc.slug}`}>{doc.title}</Link>
              </Button>
            ))}
            {hasAppPage && (
              <Button variant="ghost" asChild>
                <Link href={localePath(locale, `/app/${app}`)}>
                  <Trans>About {appName}</Trans>
                </Link>
              </Button>
            )}
          </nav>
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

        <p className="border-t border-border pt-8 text-sm text-muted-foreground">
          <Trans>
            This site has its own documents, separate from the app&apos;s:{' '}
            <Link href={localePath(locale, '/legal')} className="underline underline-offset-4 hover:text-foreground">
              privacy and terms of the site
            </Link>
            .
          </Trans>
        </p>
      </div>
    </div>
  );
}
