/**
 * The `homepage` field of a project, turned into the URL that actually answers.
 *
 * GitHub serves a user's project pages under the custom domain of their user
 * page, so `https://tiagodanin.github.io/Repo/` is a 301 to
 * `https://tiagodanin.com/Repo/`. The field in `contents/github/index.json`
 * comes straight from the GitHub API and holds whatever was typed there years
 * ago: 47 of the 54 entries use the `.github.io` host, one is still `http:`,
 * three lack the trailing slash.
 *
 * `scripts/generateSitemaps.ts` normalized this for the sitemap and the pages
 * did not, so the sitemap announced the canonical URL while every link on the
 * site pointed at the redirect, including the `"url"` of the ItemList JSON-LD
 * on `/github-pages`. Ahrefs found `/CAMCovers/` through the `http://` link.
 * One normalizer, read by both sides, is what keeps them from disagreeing.
 *
 * Client-safe on purpose: no `nextjs-studio/server` import, so a page can
 * normalize before handing the value to a client component.
 */
import { ORIGIN } from '@/lib/i18n/seo';

/** The two hosts that resolve to this site, in either scheme, with or without `www.`. */
const GITHUB_PAGES_HOST = /^https?:\/\/(www\.)?tiagodanin\.github\.io/i;
const SITE_HOST = /^https?:\/\/(www\.)?tiagodanin\.com/i;

/**
 * Homepages this site serves but must not announce.
 *
 * `TestGithub` is a scratch repo whose Page still ships the generator's
 * placeholders: the title is `MyRepo`, the description `MY DESCRIPTION`, and
 * `og:image` and `og:url` are both empty strings. GitHub serves it at
 * `/TestGithub/` and at `/TestGithub/index.html`, so the one sitemap entry put
 * two copies of a page that says nothing into the index.
 *
 * Compared against the pathname, lowercased, because the field in
 * `contents/github/index.json` spells the host `TiagoDanin.github.io` and
 * `yarn data:github` rewrites that file from the API on every run: a filter on
 * the content would be undone by the next fetch.
 */
const UNLISTED_HOMEPAGE_PATHS = new Set(['/testgithub/']);

function withSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

/**
 * The URL to put in an `href`.
 *
 * Rewrites the hosts that redirect to this one and leaves everything else
 * alone: an external homepage is not ours to normalize, and forcing `https:`
 * on a third-party host can break a link that works.
 */
export function canonicalHomepage(homepage?: string | null): string {
  const raw = (homepage ?? '').trim();
  if (!raw) return '';

  if (GITHUB_PAGES_HOST.test(raw)) return withSlash(raw.replace(GITHUB_PAGES_HOST, ORIGIN));
  if (SITE_HOST.test(raw)) return withSlash(raw.replace(SITE_HOST, ORIGIN));

  return raw;
}

/**
 * The same URL, but only when this site is the one serving it.
 *
 * What the homepage sitemap lists, so it never announces a page on someone
 * else's domain. The bare origin is the site home, already covered by
 * `sitemap-site.xml`, and two repos point at it. `UNLISTED_HOMEPAGE_PATHS`
 * drops the rest.
 */
export function siteHostedHomepage(homepage?: string | null): string | null {
  const url = canonicalHomepage(homepage);

  if (!url.toLowerCase().startsWith(`${ORIGIN.toLowerCase()}/`)) return null;
  if (url === `${ORIGIN}/`) return null;
  if (UNLISTED_HOMEPAGE_PATHS.has(new URL(url).pathname.toLowerCase())) return null;

  return url;
}
