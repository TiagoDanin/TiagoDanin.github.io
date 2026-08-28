const { staticRoutes } = require('./scripts/appRoutes.cjs');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tiagodanin.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  // next.config.ts has trailingSlash: true, so /blog is served as /blog/.
  // A sitemap listing the version without the slash points every crawl at a 308.
  trailingSlash: true,
  // The sitemap index is written by scripts/generateSitemaps.ts, which also lists
  // sitemap-project-github.xml and sitemap-homepage-github.xml alongside this file.
  sitemapBaseFileName: 'sitemap-site',
  generateIndexSitemap: false,
  // Listed elsewhere, so every sitemap in the family stays disjoint:
  // /project/github/* in sitemap-project-github.xml, /br/* in sitemap-site-br.xml.
  //
  // /en/* is excluded because it does not survive the build: next-sitemap reads
  // the route manifest, which still says the English pages live under /en,
  // while scripts/flattenDefaultLocale.ts has already moved them to the root.
  // Listing them would submit 404s. additionalPaths puts the real URLs back.
  exclude: [
    '/project/github/*',
    '/br',
    '/br/*',
    '/en',
    '/en/*',
    // Transitional aliases: they canonicalise to /br/blog/ and /br/talks/, and
    // listing a URL that points its canonical elsewhere asks a crawler to
    // index something it has been told not to.
    '/blog/pt',
    '/talks/pt',
    '/post/*/pt',
    '/talk/*/pt',
  ],

  additionalPaths: async (config) => {
    // The English pages, put back by hand: next-sitemap reads the route
    // manifest, which still says they live under /en, and /en/* is excluded
    // above because flattenDefaultLocale.ts has already moved them to the root.
    // Read off the App Router tree, so adding a page needs no edit here.
    const localized = staticRoutes();

    const faq = require('./contents/faq/index.json')
      .filter((entry) => entry.slug && String(entry.body || '').trim())
      .map((entry) => `/faq/${entry.slug}`);
    return Promise.all([...localized, ...faq].map((route) => config.transform(config, route)));
  },
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://tiagodanin.com/sitemap.xml',
      'https://tiagodanin.com/sitemap-site-br.xml',
      'https://tiagodanin.com/sitemap-project-github.xml',
      'https://tiagodanin.com/sitemap-homepage-github.xml',
      // The RSS feeds are listed as sitemaps on purpose, and this is standard,
      // not a Google-only tolerance: sitemaps.org itself says "in addition to
      // the XML protocol, we support RSS feeds and text files". Google accepts
      // RSS 2.0 and Atom 1.0; Bing accepts both and recommends them precisely
      // for signalling new URLs. What they add over the XML sitemaps is the
      // real pubDate of each entry, where `lastmod` here is only the build
      // timestamp.
      //
      // They are listed here and not inside sitemap.xml because a
      // <sitemapindex> may only reference XML sitemaps.
      //
      // Ahrefs Site Audit flags all four as "Sitemap in the wrong format /
      // Invalid representation". That is a false positive: its parser assumes
      // <urlset>/<sitemapindex> and rejects a format the protocol allows.
      // Dismiss it there; do not delete these lines to silence the report.
      'https://tiagodanin.com/rss/blog.xml',
      'https://tiagodanin.com/rss/talks.xml',
      'https://tiagodanin.com/rss/timeline.xml',
      'https://tiagodanin.com/rss/projects.xml',
    ],
  },
  transform: async (config, urlPath) => {
    let priority = 0.7;
    let changefreq = config.changefreq;

    if (urlPath === '/') {
      priority = 1;
    } else if (urlPath === '/projects' || urlPath === '/blog' || urlPath === '/talks' || urlPath === '/services') {
      priority = 0.9;
    } else if (urlPath === '/rankings/github' || urlPath === '/rankings/npm') {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (urlPath === '/llms-full.txt' || urlPath === '/llms.txt') {
      priority = 0.1;
      changefreq = 'monthly';
    } else if (urlPath === '/business') {
      priority = 0.9;
      changefreq = 'monthly';
    } else if (urlPath === '/legal') {
      priority = 0.3;
      changefreq = 'yearly';
    } else if (urlPath === '/faq') {
      priority = 0.8;
    } else if (urlPath.startsWith('/faq/')) {
      priority = 0.6;
      changefreq = 'monthly';
    } else if (urlPath === '/skills') {
      priority = 0.8;
    } else if (urlPath.startsWith('/skills/')) {
      priority = 0.5;
      changefreq = 'monthly';
    } else if (urlPath === '/tags') {
      priority = 0.8;
    } else if (urlPath.startsWith('/tags/')) {
      priority = 0.6;
    } else if (urlPath.startsWith('/post/')) {
      priority = 0.7;
    } else if (urlPath.startsWith('/blog')) {
      priority = 0.6;
    } else if (urlPath.startsWith('/project/npm/') || urlPath.startsWith('/project/github/')) {
      priority = 0.5;
      changefreq = 'monthly';
    } else if (urlPath.startsWith('/project/')) {
      priority = 0.3;
      changefreq = 'monthly';
    } else if (urlPath.startsWith('/timeline/')) {
      priority = 0.2;
      changefreq = 'monthly';
    } else if (urlPath.startsWith('/talk/')) {
      priority = 0.4;
      changefreq = 'monthly';
    } else if (urlPath.startsWith('/social/')) {
      priority = 0.1;
      changefreq = 'monthly';
    } else if (urlPath.startsWith('/about')) {
      priority = 0.5;
      changefreq = 'monthly';
    }

    // Normalized here too: the priority rules above match on the slash-less
    // path, and a custom transform bypasses the config's own trailingSlash.
    const loc = urlPath.endsWith('/') ? urlPath : `${urlPath}/`;

    // Every route exists under /br as well, so all of them announce the pair and
    // the two languages read as one page in two versions rather than two
    // competing URLs.
    //
    // This used to be gated on a six-entry list plus `localizedPrefix`, a name
    // that was never defined: any path outside those six threw a ReferenceError
    // and took the whole sitemap step with it. sitemap-site-br.xml announced the
    // pair for all thirty pages meanwhile, so the two files contradicted each
    // other about the same URLs.
    const alternateRefs = [
      // hrefIsAbsolute, or next-sitemap treats href as that language's root
      // and appends the path again: /about/ would come out /about/about/.
      { href: `https://tiagodanin.com${loc}`, hreflang: 'en', hrefIsAbsolute: true },
      {
        href: `https://tiagodanin.com/br${urlPath === '/' ? '/' : `${urlPath}/`}`,
        hreflang: 'pt-BR',
        hrefIsAbsolute: true,
      },
      { href: `https://tiagodanin.com${loc}`, hreflang: 'x-default', hrefIsAbsolute: true },
    ];

    return {
      loc,
      changefreq: changefreq,
      priority: priority,
      alternateRefs,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
