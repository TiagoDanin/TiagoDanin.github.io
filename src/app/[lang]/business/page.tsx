import type { Metadata } from 'next';
import { t } from '@lingui/core/macro';
import { queryCollection } from 'nextjs-studio/server';

import { BusinessContact } from '@/components/sections/business/BusinessContact';
import { BusinessFit } from '@/components/sections/business/BusinessFit';
import { BusinessHero } from '@/components/sections/business/BusinessHero';
import { BusinessOfferings } from '@/components/sections/business/BusinessOfferings';
import { BusinessProcess } from '@/components/sections/business/BusinessProcess';
import { BusinessProof } from '@/components/sections/business/BusinessProof';
import { BusinessRegistry } from '@/components/sections/business/BusinessRegistry';
import { BusinessStack } from '@/components/sections/business/BusinessStack';
import { businessPageSchema } from '@/lib/business-jsonld';
import { localePath } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import {
  localeAlternates,
  markdownAlternate,
  openGraphDefaults,
  pageUrl,
  twitterDefaults,
} from '@/lib/i18n/seo';
import { getBusinessData } from '@/lib/sections';

export async function generateMetadata({
  params,
}: PageProps<'/[lang]/business'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const business = getBusinessData(locale);

  const title = business.seoTitle || business.tradeName;
  const description = business.seoDescription.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      ...localeAlternates(locale, '/business'),
      types: markdownAlternate('/business'),
    },
    openGraph: {
      title,
      description,
      url: pageUrl(locale, '/business'),
      type: 'website',
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title,
      description,
    },
  };
}

export default async function BusinessPage({ params }: PageProps<'/[lang]/business'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const business = getBusinessData(locale);
  const about = queryCollection('about').locale(locale).one();
  const linkedIn = queryCollection('sociallinks').find((link) => link.label === 'LinkedIn');
  const skills = [...queryCollection('skills').locale(locale)];



  const email = String(about.email ?? '');
  const resolveHref = (href: string) => localePath(locale, href);

  const sameAs = [...queryCollection('sociallinks')]
    .map((link) => (typeof link.url === 'string' ? link.url : ''))
    .filter(Boolean);

  const jsonLd = businessPageSchema(
    locale,
    business,
    {
      home: t(i18n)`Home`,
      business: t(i18n)`Company`,
      catalog: business.offeringsTitle,
    },
    { email, sameAs }
  );

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BusinessHero
        eyebrow={business.eyebrow}
        headline={business.headline}
        lede={business.lede}
        chips={business.chips}
        email={email}
        emailLabel={business.contactEmailLabel}
        recordLabel={business.heroRecordLabel}
      />

      <BusinessProof
        title={business.proofTitle}
        note={business.proofNote}
        trackTitle={business.trackTitle}
        track={business.track}
        items={business.proof}
        resolveHref={resolveHref}
      />

      <BusinessOfferings
        title={business.offeringsTitle}
        note={business.offeringsNote}
        offerings={business.offerings}
        resolveHref={resolveHref}
      />

      <BusinessFit
        title={business.audienceTitle}
        note={business.audienceNote}
        items={business.audience}
      />

      <BusinessProcess
        title={business.processTitle}
        note={business.processNote}
        steps={business.process}
      />

      <BusinessStack
        title={business.stackTitle}
        note={business.stackNote}
        groups={skills.map((group) => ({
          category: String(group.category ?? ''),
          items: (Array.isArray(group.items) ? group.items : []).map(
            (item: { name?: unknown; icon?: unknown; color?: unknown }) => ({
              name: String(item?.name ?? ''),
              icon: String(item?.icon ?? ''),
              color: String(item?.color ?? ''),
            })
          ),
        }))}
      />

      <BusinessRegistry
        title={business.registryTitle}
        note={business.registryNote}
        records={business.registry}
        linkLabel={business.registryLinkLabel}
        linkHref={business.registryLinkHref}
      />

      <BusinessContact
        title={business.contactTitle}
        detail={business.contactDetail}
        note={business.contactNote}
        email={email}
        emailLabel={business.contactEmailLabel}
        linkedInUrl={linkedIn?.url}
        linkedInLabel={business.contactLinkedInLabel}
      />
    </div>
  );
}
