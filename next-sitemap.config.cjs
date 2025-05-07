/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tiagodanin.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  additionalSitemaps: [
    'https://tiagodanin.com/github-sitemap.xml',
  ],
  transform: async (config, path) => {
    let priority = 0.7;
    let changefreq = config.changefreq;

    if (path === '/') {
      priority = 1;
    } else if (path === '/timeline' ||  path === '/projects' || path === '/blog') {
      priority = 0.9;
    } else if (path.startsWith('/blog')) {
      priority = 0.6; 
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};