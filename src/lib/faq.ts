import { intlLocale, type Locale } from '@/lib/i18n/locales';

export type FaqLayout =
  | 'profile'
  | 'evidence'
  | 'matrix'
  | 'steps'
  | 'service';

export const FAQ_LAYOUTS: readonly FaqLayout[] = [
  'profile',
  'evidence',
  'matrix',
  'steps',
  'service',
] as const;

export interface FaqFact {
  label: string;
  value: string;
}

export interface FaqEvidence {
  date: string;
  title: string;
  detail: string;
  href?: string;
}

export interface FaqMatrixRow {
  item: string;
  where: string;
  proof: string;
  href?: string;
}

export interface FaqStep {
  title: string;
  detail: string;
}

export interface FaqLink {
  label: string;
  href: string;
}

export interface FaqEntry {
  slug: string;
  layout: FaqLayout;
  category: string;
  question: string;
  answer: string;
  body?: string;
  facts?: FaqFact[];
  evidence?: FaqEvidence[];
  matrix?: FaqMatrixRow[];
  steps?: FaqStep[];
  offering?: FaqStep[];
  links?: FaqLink[];
  related?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export type FaqRow = Record<string, unknown>;

export interface FaqStats {
  talkCount: number;
  postCount: number;
  repoCount: number;
  npmCount: number;
  npmDownloads: number;
  polybarStars: number;
}

function compact(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function fill(text: string, stats: FaqStats, locale: Locale): string {
  return text
    .replaceAll('{talkCount}', String(stats.talkCount))
    .replaceAll('{postCount}', String(stats.postCount))
    .replaceAll('{repoCount}', String(stats.repoCount))
    .replaceAll('{npmCount}', String(stats.npmCount))
    .replaceAll('{npmDownloads}', compact(stats.npmDownloads, locale))
    .replaceAll('{polybarStars}', String(stats.polybarStars));
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function arr<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function isLayout(value: unknown): value is FaqLayout {
  return typeof value === 'string' && (FAQ_LAYOUTS as readonly string[]).includes(value);
}

export function buildFaq(rows: readonly FaqRow[], stats: FaqStats, locale: Locale): FaqEntry[] {
  const entries: FaqEntry[] = [];

  for (const row of rows) {
    const slug = str(row.slug);
    const answer = str(row.answer);
    if (!slug || !answer) continue;

    const text = (value: unknown) => fill(str(value), stats, locale);

    entries.push({
      slug,
      layout: isLayout(row.layout) ? row.layout : 'profile',
      category: str(row.category),
      question: text(row.question),
      answer: text(answer),
      body: text(row.body),
      facts: arr<FaqFact>(row.facts).map((f) => ({
        label: text(f.label),
        value: text(f.value),
      })),
      evidence: arr<FaqEvidence>(row.evidence).map((e) => ({
        date: str(e.date),
        title: text(e.title),
        detail: text(e.detail),
        href: str(e.href) || undefined,
      })),
      matrix: arr<FaqMatrixRow>(row.matrix).map((m) => ({
        item: text(m.item),
        where: text(m.where),
        proof: text(m.proof),
        href: str(m.href) || undefined,
      })),
      steps: arr<FaqStep>(row.steps).map((s) => ({
        title: text(s.title),
        detail: text(s.detail),
      })),
      offering: arr<FaqStep>(row.offering).map((o) => ({
        title: text(o.title),
        detail: text(o.detail),
      })),
      links: arr<FaqLink>(row.links)
        .filter((l) => str(l.href))
        .map((l) => ({ label: text(l.label), href: str(l.href) })),
      related: arr<string | { slug?: string }>(row.related)
        .map((item) => (typeof item === 'string' ? item : str(item?.slug)))
        .filter(Boolean),
      seoTitle: text(row.seoTitle) || undefined,
      seoDescription: text(row.seoDescription) || undefined,
    });
  }

  return entries;
}

export function faqWithPages(entries: readonly FaqEntry[]): FaqEntry[] {
  return entries.filter((entry) => (entry.body ?? '').trim().length > 0);
}

export function findFaqEntry(entries: readonly FaqEntry[], slug: string): FaqEntry | undefined {
  return entries.find((entry) => entry.slug === slug);
}

export function groupFaqByCategory(entries: readonly FaqEntry[]): Array<{
  category: string;
  entries: FaqEntry[];
}> {
  const groups = new Map<string, FaqEntry[]>();

  for (const entry of entries) {
    const key = entry.category || 'Geral';
    const bucket = groups.get(key);
    if (bucket) bucket.push(entry);
    else groups.set(key, [entry]);
  }

  return [...groups].map(([category, list]) => ({ category, entries: list }));
}

export function relatedFaqEntries(
  entries: readonly FaqEntry[],
  entry: FaqEntry,
  limit = 3
): FaqEntry[] {
  return (entry.related ?? [])
    .map((slug) => findFaqEntry(entries, slug))
    .filter(
      (found): found is FaqEntry =>
        Boolean(found) && found!.slug !== entry.slug && (found!.body ?? '').trim().length > 0
    )
    .slice(0, limit);
}
