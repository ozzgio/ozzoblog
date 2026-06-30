/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://ozzo.blog",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "weekly",
  priority: 0.7,
  autoLastmod: true,
  // Exclude dynamic routes backed by external data (slugs can change between builds)
  // and server-side routes that are not indexable content pages.
  exclude: ["/books/*", "/articles/*", "/rss.xml", "/newsletter/*"],
  transform: async (config, path) => {
    let priority = 0.7;
    let changefreq = "weekly";

    if (path === "/") {
      priority = 1.0;
    } else if (["/articles", "/projects"].includes(path)) {
      priority = 0.9;
    } else if (path === "/books") {
      priority = 0.8;
    } else if (path.startsWith("/projects/")) {
      priority = 0.8;
      changefreq = "monthly";
    } else if (path === "/contacts") {
      priority = 0.7;
      changefreq = "monthly";
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
