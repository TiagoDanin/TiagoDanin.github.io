/**
 * The site's static routes, read off the App Router tree.
 *
 * There used to be four hand-kept copies of this list: `LOCALIZED_ROUTES` in
 * `src/lib/i18n/locales.ts`, the dev rewrites in `next.config.ts`, and two in
 * `next-sitemap.config.cjs`. They drifted, as copies do: the one that decided
 * which English URLs announce an `hreflang` pair had six routes in it while the
 * Portuguese sitemap announced the pair for all thirty, so the two sitemaps
 * contradicted each other about the same pages.
 *
 * The directory is the list. A page that exists is a route; there is nothing to
 * register.
 *
 * CommonJS on purpose: `next-sitemap.config.cjs` can only `require`, and tsx
 * imports this happily from `scripts/generateSitemaps.ts`.
 */
const fs = require('node:fs');
const path = require('node:path');

const APP_DIR = path.join(__dirname, '..', 'src', 'app', '(i18n)', '[lang]');

/**
 * Routes with no dynamic segment, as paths without a trailing slash (`/` aside).
 *
 * Dynamic segments are skipped rather than enumerated: their children come from
 * `contents/`, and the callers that need them read the collections directly.
 * Route groups (`(name)`) and private folders (`_name`) contribute no segment.
 */
function staticRoutes(dir = APP_DIR, prefix = '') {
  const routes = [];

  if (fs.existsSync(path.join(dir, 'page.tsx'))) {
    routes.push(prefix === '' ? '/' : prefix);
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    const name = entry.name;
    if (name.includes('[') || name.startsWith('_') || name.startsWith('@')) continue;

    const segment = name.startsWith('(') && name.endsWith(')') ? '' : `/${name}`;
    routes.push(...staticRoutes(path.join(dir, name), `${prefix}${segment}`));
  }

  return routes.sort();
}

module.exports = { staticRoutes };
