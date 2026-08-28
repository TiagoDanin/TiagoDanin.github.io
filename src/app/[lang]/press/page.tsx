import type { Metadata } from "next";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { queryCollection } from 'nextjs-studio/server';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPressItems, pressDate, pressHost } from "@/lib/press";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { intlLocale, localePath } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphDefaults, pageUrl, twitterDefaults } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/press'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Press Coverage - Articles & Interviews`,
    description: t(
      i18n
    )`Articles, interviews and releases that mention Tiago Danin, from the TecBan open banking hackathon to game development in Pará.`,
    keywords: ["Tiago Danin press", "media coverage", "imprensa", "TecBan Hackathon", "Bicos app", "open banking", "entrevista"],
    alternates: {
      ...localeAlternates(locale, '/press'),
      types: markdownAlternate('/press'),
    },
    openGraph: {
      title: t(i18n)`Press Coverage - Tiago Danin`,
      description: t(i18n)`Articles, interviews and releases that mention Tiago Danin.`,
      url: pageUrl(locale, '/press'),
      type: "website",
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      card: 'summary',
      title: t(i18n)`Press Coverage - Tiago Danin`,
      description: t(i18n)`Articles, interviews and releases that mention Tiago Danin.`,
      site: '@tiagodanin',
    },
  };
}

const PressPage = async ({ params }: PageProps<'/[lang]/press'>) => {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const about = queryCollection('about').locale(locale).one();
  const items = getPressItems();

  const years = items.map(item => item.date.slice(0, 4)).filter(Boolean).sort();
  const range = years.length
    ? (years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`)
    : '';
  const outlets = Array.from(new Set(items.map(item => item.outlet)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "name": t(i18n)`Press Coverage - Tiago Danin`,
        "url": pageUrl(locale, '/press'),
        "about": {
          "@type": "Person",
          "name": about.name,
          "url": pageUrl(locale, '/'),
        },
        "hasPart": items.map(item => ({
          "@type": "NewsArticle",
          "headline": item.title,
          "url": item.url,
          "datePublished": item.date,
          "inLanguage": item.lang === 'pt' ? 'pt-BR' : 'en',
          "publisher": { "@type": "Organization", "name": item.outlet },
          ...(item.author ? { "author": { "@type": "Person", "name": item.author } } : {}),
        })),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": t(i18n)`Home`,
            "item": pageUrl(locale, '/')
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": t(i18n)`Press Kit`,
            "item": pageUrl(locale, '/press-kit')
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": t(i18n)`Press`,
            "item": pageUrl(locale, '/press')
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative pt-32 pb-12 overflow-x-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 right-0 w-[420px] h-[420px] bg-blue-100 rounded-full blur-3xl opacity-25 translate-x-1/3"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-20 w-[360px] h-[360px] bg-yellow-100 rounded-full blur-3xl opacity-30"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              <Trans>Press</Trans>
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
              <Trans>Where I have been mentioned</Trans>
            </h1>
            <p className="text-lg text-foreground/85 leading-relaxed">
              <Trans>
                Articles, interviews and releases published by others. Everything here is
                in Portuguese, and every link goes to the original source.
              </Trans>
            </p>

            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 pt-7 border-t border-border/60">
              <div className="space-y-1">
                <dt className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">
                  {items.length}
                </dt>
                <dd className="text-xs text-muted-foreground leading-tight"><Trans>pieces</Trans></dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">
                  {outlets.length}
                </dt>
                <dd className="text-xs text-muted-foreground leading-tight"><Trans>outlets</Trans></dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">
                  {range}
                </dt>
                <dd className="text-xs text-muted-foreground leading-tight"><Trans>published</Trans></dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <ul className="grid gap-6 lg:max-w-4xl">
            {items.map(item => (
              <li key={item.url}>
                <article className="rounded-xl border bg-background p-6 shadow-xs transition-shadow hover:shadow-md">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-semibold">{item.outlet}</span>
                    <span aria-hidden="true" className="text-muted-foreground">·</span>
                    <time dateTime={item.date} className="text-sm text-muted-foreground">
                      {pressDate(item.date, intlLocale(locale))}
                    </time>
                    <Badge variant="outline" className="font-normal">
                      {item.topic}
                    </Badge>
                  </div>

                  <h2 className="mt-3 text-lg sm:text-xl font-semibold leading-snug">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline hover:text-primary transition-colors"
                    >
                      {item.title}
                      <ExternalLink
                        className="ml-1.5 inline h-4 w-4 align-baseline text-muted-foreground group-hover:text-primary transition-colors"
                        aria-hidden="true"
                      />
                    </a>
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.summary}
                  </p>

                  {item.quote && (
                    <blockquote
                      lang={item.lang}
                      className="mt-4 border-l border-border pl-4 text-sm italic text-foreground/80 leading-relaxed"
                    >
                      {item.quote}
                    </blockquote>
                  )}

                  <p className="mt-4 text-xs text-muted-foreground">
                    {item.author ? `${item.author} · ` : ''}{pressHost(item.url)}
                  </p>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Button variant="outline" asChild className="min-h-[44px]">
              <Link href={localePath(locale, '/press-kit')}>
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                <Trans>Back to the press kit</Trans>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default PressPage;
