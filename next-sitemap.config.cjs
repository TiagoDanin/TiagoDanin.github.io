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
  // Listed by sitemap-project-github.xml instead, so the three sitemaps stay disjoint.
  exclude: ['/project/github/*'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://tiagodanin.com/sitemap.xml',
      'https://tiagodanin.com/sitemap-project-github.xml',
      'https://tiagodanin.com/sitemap-homepage-github.xml',
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

    return {
      loc,
      changefreq: changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
