import { intlLocale, type Locale } from '@/lib/i18n/locales';

/**
 * The FAQ collection: one question per entry, answered so that the answer works
 * when it is lifted out of the page.
 *
 * The site is not found by anyone searching its own category. A search for
 * "desenvolvedor Flutter Belém" returns job boards and agencies, and no person.
 * These entries exist to answer that question directly, with a dated fact and a
 * link behind every claim.
 */

/**
 * Which shape sustains the answer.
 *
 * The choice is not decorative: each one is a different extractable block, and
 * each carries its own schema.org type on the detail page. The answer itself is
 * identical across all five, always first, always self contained. The layout
 * only decides what backs it up.
 */
export type FaqLayout =
  /** who someone is: an identity card plus linked proof. `Person`. */
  | 'profile'
  /** what someone has done: a dated list, newest first. `ItemList`. */
  | 'evidence'
  /** whether someone covers X and Y: a table of thing, where, proof. `ItemList`. */
  | 'matrix'
  /** how something works: numbered steps. `HowTo`. */
  | 'steps'
  /** what someone takes on: scope and limits. `Service`. */
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

/**
 * One entry, in one language.
 *
 * The studio has no discriminated union, so every block is optional and
 * `layout` decides which one is rendered. Filling `steps` on a `profile` entry
 * is harmless; it simply never reaches the page.
 */
export interface FaqEntry {
  slug: string;
  layout: FaqLayout;
  category: string;
  question: string;
  /**
   * 40 to 60 words, self contained.
   *
   * This is the field an answer engine lifts. It has to survive being read with
   * no page around it, which is why it repeats the subject instead of saying
   * "he".
   */
  answer: string;
  /**
   * The body of the detail page.
   *
   * Empty on purpose when the question has no material behind it. An entry with
   * no body stays on the index as an anchor and never gets a page of its own,
   * which is what keeps 30 near identical short pages from reading as doorway
   * pages.
   */
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

/** A row as it sits in contents/faq, before tokens are filled in. */
export type FaqRow = Record<string, unknown>;

/**
 * The numbers the copy refers to, counted from the other collections at build
 * time.
 *
 * They are counted rather than written because a number written into prose goes
 * stale the moment the 67th package ships, and because a research agent writing
 * this FAQ inflated 19 talks into "35+" and 141 repositories into "250+". A
 * counted number cannot be wrong in that direction.
 */
export interface FaqStats {
  talkCount: number;
  postCount: number;
  repoCount: number;
  npmCount: number;
  npmDownloads: number;
  polybarStars: number;
}

/**
 * Compact form of a download count: "4,4 mi" in Portuguese, "4.4M" in English.
 *
 * Through `intlLocale` and never the raw code. `br` is also the subtag for
 * Breton, so `Intl.NumberFormat("br")` does not throw, it just formats the
 * wrong language.
 */
function compact(value: number, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/** Replaces the `{token}` placeholders the content uses for moving numbers. */
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

/**
 * Normalises the collection rows and fills every token.
 *
 * A row with no slug or no answer is dropped rather than rendered half empty: it
 * would reach the index as a question with nothing under it.
 */
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
      // The studio's array field always wraps items in an object, so a `related`
      // edited there arrives as `[{ slug }]` while the hand written JSON uses
      // plain strings. Both mean the same thing.
      related: arr<string | { slug?: string }>(row.related)
        .map((item) => (typeof item === 'string' ? item : str(item?.slug)))
        .filter(Boolean),
      seoTitle: text(row.seoTitle) || undefined,
      seoDescription: text(row.seoDescription) || undefined,
    });
  }

  return entries;
}

/** The entries that earn a page of their own: the ones with a body behind them. */
export function faqWithPages(entries: readonly FaqEntry[]): FaqEntry[] {
  return entries.filter((entry) => (entry.body ?? '').trim().length > 0);
}

export function findFaqEntry(entries: readonly FaqEntry[], slug: string): FaqEntry | undefined {
  return entries.find((entry) => entry.slug === slug);
}

/** Index order: categories in first-seen order, entries in collection order. */
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

/** Resolves `related` slugs to entries, dropping the ones that do not exist. */
export function relatedFaqEntries(
  entries: readonly FaqEntry[],
  entry: FaqEntry,
  limit = 3
): FaqEntry[] {
  return (entry.related ?? [])
    .map((slug) => findFaqEntry(entries, slug))
    .filter((found): found is FaqEntry => Boolean(found) && found!.slug !== entry.slug)
    .slice(0, limit);
}
