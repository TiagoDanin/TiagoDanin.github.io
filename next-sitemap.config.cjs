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
    // Keep in step with LOCALIZED_ROUTES in src/lib/i18n/locales.ts.
    const localized = ['/', '/about', '/services', '/projects', '/blog', '/talks', '/ai-automation', '/all-contacts', '/chrome-extensions', '/cybersecurity', '/game-development', '/mentorship', '/mobile', '/apps', '/github-pages', '/links', '/links/talk', '/press', '/rankings/github', '/rankings/npm', '/rss', '/sitemap', '/skills', '/tags', '/web-development'];
    const localizedPrefix = ['/post/', '/talk/', '/app/', '/skills/', '/social/', '/tags/'].some((p) => urlPath.startsWith(p));
    return Promise.all(localized.map((route) => config.transform(config, route)));
  },
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

    // Routes that also exist under /br announce the pair, so the two languages
    // read as one page in two versions instead of two competing URLs. Keep in
    // step with LOCALIZED_ROUTES in src/lib/i18n/locales.ts.
    const localized = ['/', '/about', '/services', '/projects', '/blog', '/talks'];
    const alternateRefs = localized.includes(urlPath) || localizedPrefix
      ? [
          // hrefIsAbsolute, or next-sitemap treats href as that language's root
          // and appends the path again: /about/ would come out /about/about/.
          { href: `https://tiagodanin.com${loc}`, hreflang: 'en', hrefIsAbsolute: true },
          {
            href: `https://tiagodanin.com/br${urlPath === '/' ? '/' : `${urlPath}/`}`,
            hreflang: 'pt-BR',
            hrefIsAbsolute: true,
          },
          { href: `https://tiagodanin.com${loc}`, hreflang: 'x-default', hrefIsAbsolute: true },
        ]
      : undefined;

    return {
      loc,
      changefreq: changefreq,
      priority: priority,
      alternateRefs,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
