import { queryCollection } from 'nextjs-studio/server';

import { DEFAULT_LOCALE, type Locale } from '@/lib/i18n/locales';
import { titleToSlug } from '@/utils/parse';

export interface SkillItem {
  name: string;
  icon: string;
  color: string;
}

export interface SkillsEntry {
  category: string;
  items: SkillItem[];
}

export interface SkillRef {
  /** The item as the reader sees it, in the page's language. */
  skill: SkillItem;
  /** The category as the reader sees it, in the page's language. */
  category: string;
  /** URL segment. Derived from `englishName`, so it is the same in every language. */
  slug: string;
  /**
   * The English name, which is the key for anything shared across languages:
   * the description dictionary, the tag match against posts and talks, and the
   * project language match.
   */
  englishName: string;
}

/**
 * Every skill in one flat list, in the reader's language, keyed by a slug that
 * does not change with the language.
 *
 * The slug comes from the English name on purpose. Soft-skill names *are*
 * translated ("Leadership" -> "Liderança"), so slugging the localized name gave
 * the two languages two different URLs for one page, and every cross-language
 * link between them 404'd: `/skills/communication/` announced
 * `hreflang="pt-BR"` for `/br/skills/communication/`, which was never built,
 * and the Portuguese page pointed back at `/skills/comunicacao/`, which was
 * not either. The language switcher wrote the same dead link.
 *
 * Both files share the same category and item order, so position is the stable
 * cross-locale key. A skill added to one file and not the other shifts that
 * alignment, which is why the fallback is the localized name rather than a
 * neighbour's.
 */
export function getAllSkills(locale: Locale): SkillRef[] {
  const skills = [...queryCollection('skills').locale(locale)] as SkillsEntry[];
  const enSkills =
    locale === DEFAULT_LOCALE
      ? skills
      : ([...queryCollection('skills').locale(DEFAULT_LOCALE)] as SkillsEntry[]);

  return skills.flatMap((category, ci) =>
    category.items.map((item, ii) => {
      const englishName = enSkills[ci]?.items[ii]?.name ?? item.name;

      return {
        skill: item,
        category: category.category,
        slug: titleToSlug(englishName),
        englishName,
      };
    })
  );
}

export function getSkillBySlug(locale: Locale, slug: string): SkillRef | null {
  return getAllSkills(locale).find((entry) => entry.slug === slug) ?? null;
}

/** The categories as the listing page renders them, each item carrying its slug. */
export function getSkillCategories(locale: Locale): Array<{ category: string; items: SkillRef[] }> {
  const all = getAllSkills(locale);
  const groups = new Map<string, SkillRef[]>();

  for (const entry of all) {
    const items = groups.get(entry.category);
    if (items) items.push(entry);
    else groups.set(entry.category, [entry]);
  }

  return [...groups].map(([category, items]) => ({ category, items }));
}
