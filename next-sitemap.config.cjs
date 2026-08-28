const fs = require('node:fs');
const path = require('node:path');

// next.config.ts sets distDir: 'dist', and `yarn deploy` builds before it runs
// `yarn sitemap`, so the export is on disk by the time this config is loaded.
const DIST_DIR = path.join(__dirname, 'dist');

// `<meta name="robots">` is emitted near the top of <head>; the deepest one
// measured sits 2.3 kB in. Reading a fixed head off each file keeps this a
// couple of megabytes rather than the ~70 MB a full read of every page costs.
const HEAD_BYTES = 32 * 1024;

// Directories under dist/ that hold no page: the client bundle, the RSC payload
// dumps, the Portuguese half (sitemap-site-br.xml lists those), and the two
// error pages, which are noindex anyway.
const SKIP_DIRS = new Set(['_next', 'br', '404', '_not-found']);

/**
 * Every English page, read off the build output.
 *
 * next-sitemap reads the route manifest instead, and since the `[lang]`
 * migration that manifest says every English page lives under `/en`. They do
 * not: `scripts/flattenDefaultLocale.ts` moves `dist/en/**` to the root after
 * the build, which is why `/en/*` is excluded below. `additionalPaths` used to
 * put back only the static routes plus the FAQ, so the sitemap went from 379
 * URLs to 63 and every dynamic English page - 300 of them, every post, talk,
 * project, app, tag, skill, timeline event and blog page - silently stopped
 * being submitted.
 *
 * The exported tree is the answer to the question the manifest was being asked.
 * It is also the only source that cannot drift from what shipped: enumerating
 * `contents/` here would mean a second, worse copy of ten `generateStaticParams`
 * functions plus the slug rules, free to disagree with the pages that exist.
 * A directory holding an index.html is a page; nothing else in dist/ has one.
 */
function builtRoutes() {
  if (!fs.existsSync(DIST_DIR)) {
    throw new Error(
      'dist/ not found. next-sitemap reads the exported pages, so the build has to run first: `yarn deploy` chains build -> sitemap -> build.'
    );
  }

  const routes = [];

  const walk = (dir, prefix) => {
    if (fs.existsSync(path.join(dir, 'index.html'))) {
      routes.push(prefix === '' ? '/' : prefix);
    }

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      // `__next.$d$lang/` and friends are build metadata, not routes.
      if (entry.name.startsWith('__next.')) continue;
      if (prefix === '' && SKIP_DIRS.has(entry.name)) continue;

      walk(path.join(dir, entry.name), `${prefix}/${entry.name}`);
    }
  };

  walk(DIST_DIR, '');

  return routes
    // Listed in sitemap-project-github.xml, so the family stays disjoint.
    .filter((route) => !route.startsWith('/project/github/'))
    .filter((route) => !isNoindex(route))
    .sort();
}

/** Whether the page tells crawlers not to index it, read from the page itself. */
function isNoindex(route) {
  const file = path.join(DIST_DIR, route === '/' ? '' : route, 'index.html');
  const fd = fs.openSync(file, 'r');

  try {
    const head = Buffer.alloc(HEAD_BYTES);
    const read = fs.readSync(fd, head, 0, HEAD_BYTES, 0);
    return head.subarray(0, read).includes('noindex');
  } finally {
    fs.closeSync(fd);
  }
}

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
  // Everything this file publishes comes from additionalPaths, off the exported
  // tree. The manifest paths are all excluded: /en/* does not survive the build
  // (flattenDefaultLocale.ts moves it to the root), /br/* belongs to
  // sitemap-site-br.xml and /project/github/* to sitemap-project-github.xml, so
  // every sitemap in the family stays disjoint.
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

  additionalPaths: async (config) =>
    Promise.all(builtRoutes().map((route) => config.transform(config, route))),

  robotsTxtOptions: {
    additionalSitemaps: [
      'https://tiagodanin.com/sitemap.xml',
      'https://tiagodanin.com/sitemap-site-br.xml',
      'https://tiagodanin.com/sitemap-project-github.xml',
      'https://tiagodanin.com/sitemap-homepage-github.xml',
      // Google accepts RSS 2.0 as a sitemap format, and the feeds carry the
      // pubDate freshness signal the XML sitemaps do not. They are listed here
      // and not inside sitemap.xml because a <sitemapindex> may only reference
      // XML sitemaps (sitemaps.org protocol).
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
    } else if (urlPath === '/rss/blog.xml' || urlPath === '/rss/talks.xml' || urlPath === '/rss/timeline.xml' || urlPath === '/rss/projects.xml') {
      priority = 0.1;
      changefreq = 'monthly';
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
