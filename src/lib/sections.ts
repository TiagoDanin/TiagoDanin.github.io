import { queryCollection } from 'nextjs-studio/server';

import { t } from '@lingui/core/macro';

import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { getI18nInstance } from '@/lib/i18n/server';

import type { CallToActionProps } from '@/components/sections/CallToAction';
import type { HeroAbout, HeroSocialLink, HeroStat } from '@/components/sections/Hero';
import type { TestimonialItem } from '@/components/sections/Testimonials';

import { buildFaq, type FaqEntry, type FaqRow, type FaqStats } from '@/lib/faq';
import { personSchema } from '@/lib/faq-jsonld';
import { buildBusiness, type Business, type BusinessRow, type BusinessStats } from '@/lib/business';

/**
 * Data loaders for the home and about sections whose inputs are derived rather
 * than read straight off a collection.
 *
 * The sections themselves take props, so they render in Storybook. A section
 * backed by a single `queryCollection` call does not belong here: the page
 * reads it inline. This file is for the cases where the page would otherwise
 * carry twenty lines of counting, or repeat the same lookup on six routes.
 *
 * Server-only: `queryCollection` reads the filesystem. Never import this from a
 * `'use client'` module.
 */

// Every collection that contributes to the project count in the hero.
const PROJECT_COLLECTIONS = [
  'github', 'npm', 'googleplay', 'luarocks',
  'pypi', 'atom', 'windows', 'aur', 'private', 'offline',
] as const;

const formatProjects = (n: number) => `${Math.ceil(n / 50) * 50}+`;
const formatDownloads = (n: number) => `${(Math.floor(n / 100_000) / 10).toFixed(1)}M+`;
const roundDown = (n: number, step: number) => `${Math.floor(n / step) * step}+`;

export interface HeroData {
  about: HeroAbout;
  stats: HeroStat[];
  socialLinks: HeroSocialLink[];
}

/**
 * Profile copy plus the four counts under the bio, totalled across ten project
 * collections. Derived rather than authored, so the numbers on the page cannot
 * drift from what the site actually ships.
 *
 * Used by the home page and /about.
 */
export function getHeroData(locale: Locale = DEFAULT_LOCALE): HeroData {
  const about = queryCollection('about').locale(locale).one() as unknown as HeroAbout;
  const socialLinks = [...queryCollection('sociallinks')] as unknown as HeroSocialLink[];

  const projectsTotal = PROJECT_COLLECTIONS.reduce(
    (sum, key) => sum + [...queryCollection(key)].length,
    0
  );
  const npmDownloadsTotal = [...queryCollection('npm')].reduce(
    (sum, pkg) => sum + (typeof pkg.downloads === 'number' ? pkg.downloads : 0),
    0
  );
  const posts = [...queryCollection('posts').where({ lang: 'en' })];
  const talks = [...queryCollection('talks').where({ lang: 'en' })];
  const videos = talks.filter(
    (t) => t.youtubeUrl && String(t.youtubeUrl).trim().length > 0
  );

  const i18n = getI18nInstance(locale);
  const stats: HeroStat[] = [
    { value: formatDownloads(npmDownloadsTotal), label: t(i18n)`npm downloads` },
    { value: formatProjects(projectsTotal), label: t(i18n)`projects` },
    { value: String(posts.length + videos.length), label: t(i18n)`posts & videos` },
    { value: String(talks.length), label: t(i18n)`talks` },
  ];

  return { about, stats, socialLinks };
}

/**
 * Email and LinkedIn URL behind the two closing actions.
 *
 * Trivial on its own, but the closing section runs on six routes: the home
 * page, /about, and every post and talk in both languages.
 */
export function getCallToActionData(locale: Locale = DEFAULT_LOCALE): CallToActionProps {
  const about = queryCollection('about').locale(locale).one();
  const linkedIn = queryCollection('sociallinks').find((l) => l.label === 'LinkedIn');

  return { email: about.email, linkedInUrl: linkedIn?.url };
}

export interface TestimonialsData {
  testimonials: TestimonialItem[];
  tokens: Record<string, string>;
}

/**
 * Recognition cards plus the counts their copy interpolates through `{npm}`,
 * `{talks}` and `{polybarStars}`. Package and talk totals are rounded down, so
 * the number shown is never a promise the collections cannot back.
 */
export function getTestimonialsData(locale: Locale = DEFAULT_LOCALE): TestimonialsData {
  const testimonials = [...queryCollection('testimonials').locale(locale)] as unknown as TestimonialItem[];

  const polybar = [...queryCollection('github')].find(
    (repo) => repo.name === 'Awesome-Polybar'
  );
  const polybarStars = typeof polybar?.stargazers_count === 'number'
    ? polybar.stargazers_count
    : 0;

  return {
    testimonials,
    tokens: {
      npm: roundDown([...queryCollection('npm')].length, 10),
      talks: roundDown([...queryCollection('talks')].length, 5),
      polybarStars: String(polybarStars),
    },
  };
}

export function getFaqData(locale: Locale = DEFAULT_LOCALE): FaqEntry[] {
  const rows = [...queryCollection('faq').locale(locale)] as unknown as FaqRow[];

  const polybar = [...queryCollection('github')].find((repo) => repo.name === 'Awesome-Polybar');

  const stats: FaqStats = {
    // Talks and posts exist twice, once per language, so the English rows are
    // counted rather than the file total.
    talkCount: [...queryCollection('talks').where({ lang: 'en' })].length,
    postCount: [...queryCollection('posts').where({ lang: 'en' })].length,
    repoCount: [...queryCollection('github')].length,
    npmCount: [...queryCollection('npm')].length,
    npmDownloads: [...queryCollection('npm')].reduce(
      (sum, pkg) => sum + (typeof pkg.downloads === 'number' ? pkg.downloads : 0),
      0
    ),
    polybarStars: typeof polybar?.stargazers_count === 'number' ? polybar.stargazers_count : 0,
  };

  return buildFaq(rows, stats, locale);
}

export function getFaqPerson(locale: Locale = DEFAULT_LOCALE) {
  const about = queryCollection('about').locale(locale).one() as unknown as {
    name?: string;
    bio?: string;
    avatar?: string;
    email?: string;
    roles?: string[];
  };

  const sameAs = [...queryCollection('sociallinks')]
    .map((link) => (typeof link.url === 'string' ? link.url : ''))
    .filter(Boolean);

  // Localized, like every other field in this schema: the Portuguese page
  // should not claim its subject knows "Leadership" while the page says
  // "Liderança".
  const knowsAbout = [...queryCollection('skills').locale(locale)].flatMap((group) => {
    const items = Array.isArray(group.items) ? group.items : [];
    return items
      .map((item: { name?: unknown }) => (typeof item?.name === 'string' ? item.name : ''))
      .filter(Boolean);
  });

  return personSchema(locale, {
    name: about?.name ?? 'Tiago Danin',
    jobTitle: (about?.roles ?? []).join(', ') || 'Mobile Developer',
    description: about?.bio ?? '',
    avatar: about?.avatar ?? '',
    email: about?.email ?? '',
    sameAs,
    knowsAbout,
  });
}

export function getBusinessData(locale: Locale = DEFAULT_LOCALE): Business {
  const row = queryCollection('business').locale(locale).one() as unknown as BusinessRow;

  // `.locale()` even for a read that only wants a year: without it the query
  // returns both language files, and the list doubles the moment a collection
  // gains a variant.
  const workStarts = [...queryCollection('work').locale(DEFAULT_LOCALE)]
    .map((entry) => Number(String(entry.startDate ?? '').slice(0, 4)))
    .filter((year) => Number.isFinite(year) && year > 1900);

  const stats: BusinessStats = {
    years: workStarts.length ? new Date().getFullYear() - Math.min(...workStarts) : 0,
    repoCount: [...queryCollection('github')].length,
    npmCount: [...queryCollection('npm')].length,
    npmDownloads: [...queryCollection('npm')].reduce(
      (sum, pkg) => sum + (typeof pkg.downloads === 'number' ? pkg.downloads : 0),
      0
    ),
    talkCount: [...queryCollection('talks').where({ lang: 'en' })].length,
    postCount: [...queryCollection('posts').where({ lang: 'en' })].length,
  };

  return buildBusiness(row, stats, locale);
}
