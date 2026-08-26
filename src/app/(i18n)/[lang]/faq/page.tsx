import { Metadata } from 'next';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';

import { FaqIndex } from '@/components/sections/faq/FaqIndex';
import { getFaqData, getFaqPerson } from '@/lib/sections';
import { faqPageSchema } from '@/lib/faq-jsonld';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, markdownAlternate, openGraphLocale, pageUrl } from '@/lib/i18n/seo';

export async function generateMetadata({ params }: PageProps<'/[lang]/faq'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);
  const entries = getFaqData(locale);
  const person = getFaqPerson(locale);

  const title = t(i18n)`Questions and answers`;
  const description = t(
    i18n
  )`Direct answers about Tiago Danin: mobile development in Belém, Flutter, Kotlin, Swift and React Native, independent security research, talks and community work.`;

  return {
    title,
    description,
    keywords: [
      t(i18n)`mobile developer Belém`,
      t(i18n)`Flutter developer Brazil`,
      t(i18n)`mobile security researcher`,
      t(i18n)`bug bounty Brazil`,
      t(i18n)`React Native developer`,
      t(i18n)`developer community Norte`,
    ],
    alternates: {
      ...localeAlternates(locale, '/faq'),
      types: markdownAlternate('/faq'),
    },
    openGraph: {
      title: t(i18n)`Questions and answers | Tiago Danin`,
      description,
      url: pageUrl(locale, '/faq'),
      type: 'website',
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: t(i18n)`Questions and answers | Tiago Danin`,
      description,
    },
    other: {
      'application/ld+json': JSON.stringify(
        faqPageSchema(locale, entries, person, {
          home: t(i18n)`Home`,
          faq: title,
        })
      ),
    },
  };
}

export default async function FaqPage({ params }: PageProps<'/[lang]/faq'>) {
  const locale = resolveLocale((await params).lang);
  initI18n(locale);

  const entries = getFaqData(locale);

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              <Trans>Questions and answers</Trans>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              <Trans>
                What people ask before getting in touch, answered in one place. Every answer links
                to the talk, article or repository behind it.
              </Trans>
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <FaqIndex entries={entries} locale={locale} />
        </div>
      </section>
    </div>
  );
}
