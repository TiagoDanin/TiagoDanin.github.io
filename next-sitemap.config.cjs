/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tiagodanin.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  additionalSitemaps: [
    'https://tiagodanin.com/github-sitemap.xml',
  ],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://tiagodanin.com/github-sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    let priority = 0.7;
    let changefreq = config.changefreq;

    if (path === '/') {
      priority = 1;
    } else if (path === '/projects' || path === '/blog' || path === '/talks' || path === '/services') {
      priority = 0.9;
    } else if (path === '/rankings/github' || path === '/rankings/npm') {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path === '/rss/blog.xml' || path === '/rss/talks.xml' || path === '/rss/timeline.xml' || path === '/rss/projects.xml') {
      priority = 0.1;
      changefreq = 'monthly';
    } else if (path === '/llms-full.txt' || path === '/llms.txt') {
      priority = 0.1;
      changefreq = 'monthly';
    } else if (path === '/skills') {
      priority = 0.8;
    } else if (path.startsWith('/skills/')) {
      priority = 0.5;
      changefreq = 'monthly';
    } else if (path === '/tags') {
      priority = 0.8;
    } else if (path.startsWith('/tags/')) {
      priority = 0.6;
    } else if (path.startsWith('/post/')) {
      priority = 0.7;
    } else if (path.startsWith('/blog')) {
      priority = 0.6;
    } else if (path.startsWith('/project/npm/') || path.startsWith('/project/github/')) {
      priority = 0.5;
      changefreq = 'monthly';
    } else if (path.startsWith('/project/')) {
      priority = 0.3;
      changefreq = 'monthly';
    } else if (path.startsWith('/timeline/')) {
      priority = 0.2;
      changefreq = 'monthly';
    } else if (path.startsWith('/talk/')) {
      priority = 0.4;
      changefreq = 'monthly';
    } else if (path.startsWith('/social/')) {
      priority = 0.1;
      changefreq = 'monthly';
    } else if (path.startsWith('/about')) {
      priority = 0.5;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};