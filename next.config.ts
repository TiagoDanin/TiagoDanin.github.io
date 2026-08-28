import type { NextConfig } from "next";
import { withStudio } from "nextjs-studio/next";
import { linguiMacroSwcPlugin } from "@lingui/swc-plugin/options";
import { DEFAULT_LOCALE, LOCALES } from "./src/lib/i18n/locales";

const isDev = process.env.NODE_ENV === "development";

/**
 * The default locale is served from the site root as well as from `/en`.
 *
 * In production `scripts/flattenDefaultLocale.ts` does it, moving `dist/en/**`
 * to the root after the build. There is no build in `next dev`, so without this
 * rewrite `/` 404s and `/about/` errors on a `[lang]` param that does not
 * exist, and the English site is only reachable at URLs it will never be served
 * from.
 *
 * One catch-all, not a route list. Every route lives under `(i18n)/[lang]`, so
 * anything that is not already addressed by locale belongs to the default one.
 * The lookahead is what keeps `/br/about` and `/en/about` from being rewritten
 * into `/en/br/about`; it is built from LOCALES, so a new language needs no
 * edit here. `public/` and `/_next` are matched by the filesystem before these
 * rewrites run, so the feeds, the mirrors and the assets are untouched.
 *
 * Rewrites and `output: "export"` are mutually exclusive, which is why the
 * export only applies to builds.
 */
const defaultLocaleRewrites = [
  // The home first: the catch-all's parameter needs at least one character, so
  // `/` would fall through it.
  { source: "/", destination: `/${DEFAULT_LOCALE}` },
  {
    source: `/:path((?!${LOCALES.join("|")}(?:/|$)).*)`,
    destination: `/${DEFAULT_LOCALE}/:path`,
  },
];

const nextConfig: NextConfig = {
  /**
   * Enable static exports for the App Router. Dev skips it so the rewrites
   * above can run; `yarn build` is what enforces export compatibility.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  ...(isDev ? { rewrites: async () => defaultLocaleRewrites } : { output: "export" as const }),

  /**
   * Generate /page/index.html instead of /page.html to align with GitHub Pages
   * directory-based serving and avoid unnecessary redirects.
   */
  trailingSlash: true,

  /**
   * The directory where the build output is stored.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports#the-dist-directory
   */
    distDir: 'dist',

  /**
   * Set base path. This is usually the slug of your repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,

  /**
   * Transforms the Lingui macros (`<Trans>`, `t`) at build time. Reads
   * lingui.config.ts for the locale list, so the two never drift.
   */
  experimental: {
    swcPlugins: [linguiMacroSwcPlugin()],
  },

typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
};

/**
 * withStudio puts `contents/` under the dev watcher, so editing a collection
 * hot reloads the browser instead of waiting for a manual refresh.
 */
export default withStudio(nextConfig);
