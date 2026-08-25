/**
 * Markdown mirrors of the site's pages, written by scripts/generateLlms.ts into
 * public/ and served next to the HTML: /about/ has /about.md, the home has
 * /index.md. Announcing one in the page head is what lets an agent read the page
 * without parsing the rendered markup.
 *
 * Only call this for a route the generator actually writes. Pointing the head at
 * a mirror that was never generated promises a 404 to whoever followed it.
 */
export function markdownUrl(canonical: string): string {
  const clean = canonical.replace(/\/+$/, '');
  return clean === 'https://tiagodanin.com' ? `${clean}/index.md` : `${clean}.md`;
}

/** The `alternates` pair for a page that has a mirror: canonical plus the Markdown link. */
export function withMarkdown(canonical: string) {
  return {
    canonical,
    types: { 'text/markdown': markdownUrl(canonical) },
  };
}
