export type BioLang = 'en' | 'pt';
export type BioFocus = 'general' | 'mobile' | 'flutter' | 'programming' | 'security' | 'ai' | 'career';
export type BioLength = 'short' | 'medium' | 'long';

export interface BioStats {
  /** years since the first professional role */
  years: number;
  /** year of the oldest talk */
  firstTalkYear: string;
}

/** One row of the `bios` collection in contents/bios/index.json */
export interface BioEntry {
  lang: BioLang;
  focus: BioFocus;
  short: string;
  medium: string;
  long: string;
}

export type BioSet = Record<BioLength, string>;
export type BioTable = Record<BioLang, Record<BioFocus, BioSet>>;

export const BIO_LANGUAGES: { key: BioLang; label: string; tag: string }[] = [
  { key: 'en', label: 'English', tag: 'en-US' },
  { key: 'pt', label: 'Português', tag: 'pt-BR' },
];

export const BIO_FOCUSES: { key: BioFocus; label: Record<BioLang, string> }[] = [
  { key: 'general', label: { en: 'General', pt: 'Geral' } },
  { key: 'mobile', label: { en: 'Mobile dev', pt: 'Mobile' } },
  { key: 'flutter', label: { en: 'Flutter', pt: 'Flutter' } },
  { key: 'programming', label: { en: 'Programming', pt: 'Programação' } },
  { key: 'security', label: { en: 'Security', pt: 'Segurança' } },
  { key: 'ai', label: { en: 'AI', pt: 'IA' } },
  { key: 'career', label: { en: 'Career', pt: 'Carreira' } },
];

export const BIO_LENGTHS: {
  key: BioLength;
  title: Record<BioLang, string>;
  hint: Record<BioLang, string>;
}[] = [
  {
    key: 'short',
    title: { en: 'Short', pt: 'Curta' },
    hint: {
      en: '50 to 75 words, for programs and social posts',
      pt: '50 a 75 palavras, para programação e redes sociais',
    },
  },
  {
    key: 'medium',
    title: { en: 'Medium', pt: 'Média' },
    hint: {
      en: '100 to 150 words, for event pages',
      pt: '100 a 150 palavras, para páginas de evento',
    },
  },
  {
    key: 'long',
    title: { en: 'Long', pt: 'Longa' },
    hint: {
      en: '200 to 300 words, for press and stage intros',
      pt: '200 a 300 palavras, para imprensa e palco',
    },
  },
];

export const BIO_UI: Record<BioLang, {
  language: string;
  focus: string;
  copy: string;
  copied: string;
  copyAria: string;
}> = {
  en: {
    language: 'Language',
    focus: 'Focus',
    copy: 'Copy',
    copied: 'Copied',
    copyAria: 'Copy bio',
  },
  pt: {
    language: 'Idioma',
    focus: 'Foco',
    copy: 'Copiar',
    copied: 'Copiado',
    copyAria: 'Copiar bio',
  },
};

/**
 * Bios live in the `bios` collection, not here. The only thing the code owns is
 * the two moving numbers, written as {years} and {firstTalkYear} in the content.
 */
function fill(text: string, { years, firstTalkYear }: BioStats): string {
  return text
    .replaceAll('{years}', String(years))
    .replaceAll('{firstTalkYear}', firstTalkYear);
}

const isBioLang = (value: unknown): value is BioLang =>
  BIO_LANGUAGES.some(lang => lang.key === value);

const isBioFocus = (value: unknown): value is BioFocus =>
  BIO_FOCUSES.some(focus => focus.key === value);

/**
 * A row as it comes out of the `bios` collection. Every field is unknown so the
 * guards below decide what is a valid language and focus.
 */
export interface BioRow {
  lang?: unknown;
  focus?: unknown;
  short?: unknown;
  medium?: unknown;
  long?: unknown;
}

export function buildBios(rows: readonly BioRow[], stats: BioStats): BioTable {
  const table = {} as BioTable;

  for (const lang of BIO_LANGUAGES) {
    table[lang.key] = {} as Record<BioFocus, BioSet>;
  }

  for (const row of rows) {
    if (!isBioLang(row.lang) || !isBioFocus(row.focus)) continue;
    table[row.lang][row.focus] = {
      short: fill(String(row.short ?? ''), stats),
      medium: fill(String(row.medium ?? ''), stats),
      long: fill(String(row.long ?? ''), stats),
    };
  }

  return table;
}
