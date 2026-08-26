import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Moves the default locale from its prefix to the site root.
 *
 * Every route under `src/app/(i18n)/[lang]` builds to `dist/en/**` and
 * `dist/br/**`. English is served from `/`, not `/en/`: that is the URL the
 * site has always used, and it is the canonical one. A static export cannot
 * rewrite a request, so the tree is relocated after the build instead.
 *
 * Moved, not copied. Leaving `/en/` behind would publish a second byte-identical
 * copy of every English page, and a canonical tag is a hint a crawler may
 * ignore. One address, nothing to consolidate.
 *
 * This is also what creates `dist/index.html`. Without it the domain root would
 * 404, because no route generates a page at `/` any more.
 */
const DIST = 'dist';
const DEFAULT_LOCALE = 'en';

const source = join(DIST, DEFAULT_LOCALE);

if (!existsSync(source)) {
  throw new Error(
    `Expected "${source}" after the build. Either the [lang] routes did not render, ` +
      `or DEFAULT_LOCALE no longer matches src/lib/i18n/locales.ts.`
  );
}

function countFiles(dir: string): number {
  return readdirSync(dir).reduce((total, entry) => {
    const path = join(dir, entry);
    return total + (statSync(path).isDirectory() ? countFiles(path) : 1);
  }, 0);
}

const moved = countFiles(source);

cpSync(source, DIST, { recursive: true });
rmSync(source, { recursive: true, force: true });

console.log(
  `[i18n] moved ${moved} files from ${relative('.', source)}/ to ${DIST}/ ` +
    `(default locale "${DEFAULT_LOCALE}" is served from the root, and only from there)`
);
