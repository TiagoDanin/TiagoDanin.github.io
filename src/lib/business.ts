import { intlLocale, type Locale } from '@/lib/i18n/locales';

export const BUSINESS_ICONS = ['Smartphone', 'Package', 'Shield'] as const;

export type BusinessIcon = (typeof BUSINESS_ICONS)[number];

export interface BusinessProof {
  value: string;
  label: string;
  detail: string;
  href: string;
}

export interface BusinessOffering {
  code: string;
  icon: BusinessIcon;
  title: string;
  description: string;
  bullets: string[];
  href: string;
  linkLabel: string;
}

export interface BusinessStep {
  title: string;
  detail: string;
}

export interface BusinessRecord {
  label: string;
  value: string;
}

export interface Business {
  legalName: string;
  tradeName: string;
  cnpj: string;
  foundedAt: string;
  cnpjOpenedAt: string;
  city: string;
  region: string;
  country: string;
  eyebrow: string;
  headline: string;
  lede: string;
  chips: string[];
  heroRecordLabel: string;
  trackTitle: string;
  track: string;
  proofTitle: string;
  proofNote: string;
  proof: BusinessProof[];
  offeringsTitle: string;
  offeringsNote: string;
  offerings: BusinessOffering[];
  audienceTitle: string;
  audienceNote: string;
  audience: BusinessStep[];
  stackTitle: string;
  stackNote: string;
  processTitle: string;
  processNote: string;
  process: BusinessStep[];
  registryTitle: string;
  registryNote: string;
  registryLinkLabel: string;
  registryLinkHref: string;
  registry: BusinessRecord[];
  contactTitle: string;
  contactDetail: string;
  contactNote: string;
  contactEmailLabel: string;
  contactLinkedInLabel: string;
  seoTitle: string;
  seoDescription: string;
}

export type BusinessRow = Record<string, unknown>;

export interface BusinessStats {
  years: number;
  repoCount: number;
  npmCount: number;
  npmDownloads: number;
  talkCount: number;
  postCount: number;
}

function compact(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function fill(text: string, stats: BusinessStats, locale: Locale): string {
  return text
    .replaceAll('{years}', String(stats.years))
    .replaceAll('{repoCount}', String(stats.repoCount))
    .replaceAll('{npmCount}', String(stats.npmCount))
    .replaceAll('{npmDownloads}', compact(stats.npmDownloads, locale))
    .replaceAll('{talkCount}', String(stats.talkCount))
    .replaceAll('{postCount}', String(stats.postCount));
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function arr<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function strList(value: unknown): string[] {
  return arr<string | { value?: unknown }>(value)
    .map((item) => (typeof item === 'string' ? item : str(item?.value)))
    .filter(Boolean);
}

function isIcon(value: unknown): value is BusinessIcon {
  return typeof value === 'string' && (BUSINESS_ICONS as readonly string[]).includes(value);
}

export function buildBusiness(
  row: BusinessRow,
  stats: BusinessStats,
  locale: Locale
): Business {
  const text = (value: unknown) => fill(str(value), stats, locale);

  return {
    legalName: str(row.legalName),
    tradeName: str(row.tradeName),
    cnpj: str(row.cnpj),
    foundedAt: str(row.foundedAt),
    cnpjOpenedAt: str(row.cnpjOpenedAt),
    city: str(row.city),
    region: str(row.region),
    country: str(row.country),
    eyebrow: text(row.eyebrow),
    headline: text(row.headline),
    lede: text(row.lede),
    chips: strList(row.chips).map((chip) => text(chip)),
    heroRecordLabel: text(row.heroRecordLabel),
    trackTitle: text(row.trackTitle),
    track: text(row.track),
    proofTitle: text(row.proofTitle),
    proofNote: text(row.proofNote),
    proof: arr<BusinessProof>(row.proof)
      .filter((item) => str(item.href))
      .map((item) => ({
        value: text(item.value),
        label: text(item.label),
        detail: text(item.detail),
        href: str(item.href),
      })),
    offeringsTitle: text(row.offeringsTitle),
    offeringsNote: text(row.offeringsNote),
    offerings: arr<BusinessOffering>(row.offerings).map((item) => ({
      code: str(item.code),
      icon: isIcon(item.icon) ? item.icon : 'Smartphone',
      title: text(item.title),
      description: text(item.description),
      bullets: strList(item.bullets).map((bullet) => text(bullet)),
      href: str(item.href),
      linkLabel: text(item.linkLabel),
    })),
    audienceTitle: text(row.audienceTitle),
    audienceNote: text(row.audienceNote),
    audience: arr<BusinessStep>(row.audience).map((item) => ({
      title: text(item.title),
      detail: text(item.detail),
    })),
    stackTitle: text(row.stackTitle),
    stackNote: text(row.stackNote),
    processTitle: text(row.processTitle),
    processNote: text(row.processNote),
    process: arr<BusinessStep>(row.process).map((step) => ({
      title: text(step.title),
      detail: text(step.detail),
    })),
    registryTitle: text(row.registryTitle),
    registryNote: text(row.registryNote),
    registryLinkLabel: text(row.registryLinkLabel),
    registryLinkHref: str(row.registryLinkHref),
    registry: arr<BusinessRecord>(row.registry)
      .filter((item) => str(item.label) && str(item.value))
      .map((item) => ({ label: text(item.label), value: text(item.value) })),
    contactTitle: text(row.contactTitle),
    contactDetail: text(row.contactDetail),
    contactNote: text(row.contactNote),
    contactEmailLabel: text(row.contactEmailLabel),
    contactLinkedInLabel: text(row.contactLinkedInLabel),
    seoTitle: text(row.seoTitle),
    seoDescription: text(row.seoDescription),
  };
}
