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
  exclude: ["/books/*", "/articles/*", "/rss.xml", "/newsletter/*", "/embed/*"],
  // Article pages are not discovered from the build output (slugs come from
  // portfolio-data), so list them here. `exclude` above runs before this hook.
  // A fetch failure only drops articles from the sitemap; it never fails the build.
  additionalPaths: async () => {
    try {
      const res = await fetch(
        "https://raw.githubusercontent.com/ozzgio/portfolio-data/main/articles.json",
        { signal: AbortSignal.timeout(10000) },
      );
      const articles = await res.json();
      return articles
        // Same rule as isInternalArticle: a slug plus a body gets its own page.
        .filter((a) => a?.slug && (a.content || a.body))
        .map((a) => {
          // An unparseable date drops only this entry's lastmod, not the list.
          const date = a.date ? new Date(a.date) : null;
          return {
            loc: `/articles/${a.slug}`,
            changefreq: "monthly",
            priority: 0.8,
            lastmod:
              date && !Number.isNaN(date.getTime())
                ? date.toISOString()
                : undefined,
          };
        });
    } catch (err) {
      console.warn("sitemap: could not load articles:", err?.message || err);
      return [];
    }
  },
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
