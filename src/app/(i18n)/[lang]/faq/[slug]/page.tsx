import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import { ChevronRight } from 'lucide-react';

import { FaqAnswer } from '@/components/sections/faq/FaqAnswer';
import { FaqProfile } from '@/components/sections/faq/FaqProfile';
import { FaqEvidence } from '@/components/sections/faq/FaqEvidence';
import { FaqMatrix } from '@/components/sections/faq/FaqMatrix';
import { FaqSteps } from '@/components/sections/faq/FaqSteps';
import { FaqService } from '@/components/sections/faq/FaqService';
import { FaqRelated } from '@/components/sections/faq/FaqRelated';

import { faqWithPages, findFaqEntry, relatedFaqEntries, type FaqEntry } from '@/lib/faq';
import { getFaqData, getFaqPerson } from '@/lib/sections';
import { qaPageSchema } from '@/lib/faq-jsonld';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localePath, type Locale } from '@/lib/i18n/locales';
import { localeAlternates, markdownAlternate, openGraphDefaults, pageUrl, twitterDefaults } from '@/lib/i18n/seo';

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  const locale = resolveLocale(params.lang);
  return faqWithPages(getFaqData(locale)).map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/faq/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);

  const entries = getFaqData(locale);
  const entry = findFaqEntry(entries, slug);
  if (!entry) return {};

  const path = `/faq/${entry.slug}`;
  const title = entry.seoTitle || entry.question;
  const description = (entry.seoDescription || entry.answer).slice(0, 160);

  return {
    title,
    description,
    alternates: {
      ...localeAlternates(locale, path),
      types: markdownAlternate(path),
    },
    openGraph: {
      title: `${title} | Tiago Danin`,
      description,
      url: pageUrl(locale, path),
      type: 'article',
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: `${title} | Tiago Danin`,
      description,
    },
    other: {
      'application/ld+json': JSON.stringify(
        qaPageSchema(locale, entry, getFaqPerson(locale), {
          home: t(i18n)`Home`,
          faq: t(i18n)`Questions and answers`,
        })
      ),
    },
  };
}

function FaqBody({ entry, locale }: { entry: FaqEntry; locale: Locale }) {
  switch (entry.layout) {
    case 'profile':
      return <FaqProfile facts={entry.facts ?? []} />;
    case 'evidence':
      return <FaqEvidence items={entry.evidence ?? []} />;
    case 'matrix':
      return <FaqMatrix rows={entry.matrix ?? []} />;
    case 'steps':
      return <FaqSteps steps={entry.steps ?? []} />;
    case 'service':
      return <FaqService offering={entry.offering ?? []} />;
    default:
      return null;
  }
}

export default async function FaqEntryPage({ params }: PageProps<'/[lang]/faq/[slug]'>) {
  const { lang, slug } = await params;
  const locale = resolveLocale(lang);
  initI18n(locale);

  const entries = getFaqData(locale);
  const entry = findFaqEntry(entries, slug);
  if (!entry || !(entry.body ?? '').trim()) notFound();

  const related = relatedFaqEntries(entries, entry);

  return (
    <div className="min-h-screen">
      <article className="container mx-auto py-32 px-4">
        <div className="max-w-2xl mx-auto space-y-12">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href={localePath(locale, '/')} className="hover:underline underline-offset-4">
                  <Trans>Home</Trans>
                </Link>
              </li>
              <li aria-hidden="true" className="flex items-center">
                <ChevronRight className="h-3 w-3 shrink-0" />
              </li>
              <li>
                <Link href={localePath(locale, '/faq')} className="hover:underline underline-offset-4">
                  <Trans>Questions and answers</Trans>
                </Link>
              </li>
            </ol>
          </nav>

          <FaqAnswer
            category={entry.category}
            question={entry.question}
            answer={entry.answer}
            as="h1"
          />

          {entry.body && (
            <div className="space-y-4 text-foreground leading-relaxed">
              {entry.body
                .split(/\n{2,}/)
                .map((paragraph) => paragraph.trim())
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          )}

          <FaqBody entry={entry} locale={locale} />

          {entry.links && entry.links.length > 0 && (
            <section aria-labelledby="faq-links" className="space-y-3">
              <h2 id="faq-links" className="text-xl font-semibold">
                <Trans>Where to check this</Trans>
              </h2>
              <ul className="space-y-2">
                {entry.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href.startsWith('http') ? link.href : localePath(locale, link.href)}
                      className="text-primary hover:underline underline-offset-4"
                      {...(link.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <FaqRelated entries={related} locale={locale} />
        </div>
      </article>
    </div>
  );
}
