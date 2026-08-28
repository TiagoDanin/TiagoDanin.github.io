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
 * `sitemap-site.xml`, and two repos point at it.
 */
export function siteHostedHomepage(homepage?: string | null): string | null {
  const url = canonicalHomepage(homepage);

  if (!url.toLowerCase().startsWith(`${ORIGIN.toLowerCase()}/`)) return null;

  return url === `${ORIGIN}/` ? null : url;
}
