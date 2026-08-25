import { queryCollection } from 'nextjs-studio/server';

import type { CallToActionProps } from '@/components/sections/CallToAction';
import type { HeroAbout, HeroSocialLink, HeroStat } from '@/components/sections/Hero';
import type { TestimonialItem } from '@/components/sections/Testimonials';

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
export function getHeroData(): HeroData {
  const about = queryCollection('about').one() as unknown as HeroAbout;
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

  const stats: HeroStat[] = [
    { value: formatDownloads(npmDownloadsTotal), label: 'npm downloads' },
    { value: formatProjects(projectsTotal), label: 'projects' },
    { value: String(posts.length + videos.length), label: 'posts & videos' },
    { value: String(talks.length), label: 'talks' },
  ];

  return { about, stats, socialLinks };
}

/**
 * Email and LinkedIn URL behind the two closing actions.
 *
 * Trivial on its own, but the closing section runs on six routes: the home
 * page, /about, and every post and talk in both languages.
 */
export function getCallToActionData(): CallToActionProps {
  const about = queryCollection('about').one();
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
export function getTestimonialsData(): TestimonialsData {
  const testimonials = [...queryCollection('testimonials')] as unknown as TestimonialItem[];

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
