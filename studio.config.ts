import type { StudioConfig } from "nextjs-studio";

const opt = (value: string) => ({ label: value, value });

const config: StudioConfig = {
  /**
   * Files without a locale suffix are English. Stamping them means `.locale("en")`
   * selects them the same way `.locale("pt")` selects `index.pt.json`, instead of
   * the default language needing a `lang` field to be reachable.
   */
  defaultLocale: "en",

  collections: {
    about: {
      schema: {
        collection: "about",
        label: "About Me",
        fields: [
          { name: "name", type: "text", required: true },
          { name: "greeting", type: "text", required: true },
          {
            name: "roles",
            type: "multi-select",
            required: true,
            options: [
              opt("Mobile Developer"),
              opt("Bug Hunter"),
              opt("Full Stack Developer"),
              opt("DevOps"),
            ],
          },
          { name: "avatar", type: "url", required: true },
          { name: "bio", type: "long-text", required: true },
          { name: "bioExtra", type: "long-text", required: true },
          { name: "seoDescription", type: "text", required: true },
          { name: "cvUrl", type: "url", required: true },
          { name: "email", type: "email", required: true },
        ],
      },
    },
    expertise: {
      schema: {
        collection: "expertise",
        label: "My Expertise",
        fields: [
          { name: "title", type: "text", required: true },
          { name: "description", type: "long-text", required: true },
          {
            name: "icon",
            type: "select",
            options: [opt("Smartphone"), opt("Code"), opt("Shield"), opt("Zap")],
          },
          { name: "link", type: "text" },
        ],
      },
    },
    skills: {
      schema: {
        collection: "skills",
        label: "Technical Skills",
        fields: [
          { name: "category", type: "text", required: true },
          {
            name: "items",
            type: "array",
            itemFields: [
              { name: "name", type: "text", required: true },
              { name: "icon", type: "text", required: true },
              { name: "color", type: "color", required: true },
            ],
          },
        ],
      },
    },
    menu: {
      schema: {
        collection: "menu",
        label: "Navigation Menu",
        fields: [
          { name: "title", type: "text", required: true },
          { name: "href", type: "text", required: true },
          { name: "navbar", type: "boolean", required: true },
          { name: "footer", type: "boolean", required: true },
          { name: "hideOnHome", type: "boolean" },
        ],
      },
    },
    sociallinks: {
      schema: {
        collection: "sociallinks",
        label: "Social Media Links",
        fields: [
          { name: "label", type: "text", required: true },
          { name: "url", type: "url", required: true },
          {
            name: "icon",
            type: "select",
            options: [opt("Github"), opt("Linkedin"), opt("Youtube"), opt("Instagram")],
          },
        ],
      },
    },
    posts: {
      mediaDir: "public/images/posts",
      schema: {
        collection: "posts",
        label: "Blog Posts",
        fields: [
          { name: "title", type: "text", required: true },
          { name: "date", type: "date", includeDay: false, required: true },
          { name: "description", type: "long-text", required: true },
          { name: "slug", type: "text", required: true },
          { name: "originalUrl", type: "url", required: true },
          {
            name: "lang",
            type: "select",
            required: true,
            options: [opt("en"), opt("pt")],
          },
          { name: "cover", type: "media", accept: ["image/*"] },
          {
            name: "tags",
            type: "multi-select",
            required: true,
            options: [
              opt("JavaScript"), opt("React"), opt("React Native"), opt("Flutter"), opt("Android"),
              opt("iOS"), opt("AI"), opt("GitHub"), opt("DevOps"), opt("Mobile"),
              opt("Web"), opt("Security"), opt("Tutorial"), opt("Performance"),
              opt("UI/UX"), opt("Testing"), opt("Backend"), opt("Frontend"),
              opt("Tools"), opt("Career"), opt("Linux"), opt("Firebase"), opt("Video"), opt("Article"),
            ],
          },
        ],
      },
    },
    talks: {
      schema: {
        collection: "talks",
        label: "Talks",
        fields: [
          { name: "title", type: "text", required: true },
          { name: "date", type: "date", includeDay: false, required: true },
          { name: "description", type: "long-text", required: true },
          { name: "slug", type: "text", required: true },
          { name: "event", type: "text", required: true },
          { name: "edition", type: "text", required: true },
          {
            name: "lang",
            type: "select",
            required: true,
            options: [opt("en"), opt("pt")],
          },
          { name: "youtubeUrl", type: "url" },
          {
            name: "tags",
            type: "multi-select",
            required: true,
            options: [
              opt("JavaScript"), opt("React"), opt("React Native"), opt("Flutter"), opt("Android"),
              opt("iOS"), opt("AI"), opt("GitHub"), opt("DevOps"), opt("Mobile"),
              opt("Web"), opt("Security"), opt("Tutorial"), opt("Performance"),
              opt("UI/UX"), opt("Testing"), opt("Backend"), opt("Frontend"),
              opt("Tools"), opt("Career"), opt("Linux"), opt("Firebase"),
            ],
          },
        ],
      },
    },
    /**
     * The two documents rendered on /legal, one MDX file each per language.
     * Prose only: the structure lives in the page, so an edit here is an edit
     * to the wording and never to the layout.
     */
    legal: {
      schema: {
        collection: "legal",
        label: "Privacy and Terms (/legal)",
        fields: [
          { name: "title", type: "text", required: true },
          {
            name: "slug",
            type: "select",
            required: true,
            options: [opt("privacy"), opt("terms")],
          },
          { name: "updatedAt", type: "date", includeDay: true, required: true },
          {
            name: "lang",
            type: "select",
            required: true,
            options: [opt("en"), opt("pt")],
          },
          { name: "description", type: "long-text", required: true },
        ],
      },
    },
    bios: {
      schema: {
        collection: "bios",
        label: "Press Kit Bios",
        fields: [
          {
            name: "lang",
            type: "select",
            required: true,
            options: [opt("en"), opt("pt")],
          },
          {
            name: "focus",
            type: "select",
            required: true,
            options: [
              opt("general"), opt("mobile"), opt("flutter"), opt("programming"),
              opt("security"), opt("ai"), opt("career"),
            ],
          },
          { name: "short", type: "long-text", required: true },
          { name: "medium", type: "long-text", required: true },
          { name: "long", type: "long-text", required: true },
        ],
      },
    },
    github: {
      scripts: {
        sync: "tsx scripts/getProjectsGithub.ts --output-terminal",
      },
    },
    npm: {
      scripts: {
        sync: "tsx scripts/getProjectsNPM.ts --output-terminal",
      },
    },
    press: {
      schema: {
        collection: "press",
        label: "Press Coverage",
        fields: [
          { name: "outlet", type: "text", required: true },
          { name: "title", type: "text", required: true },
          { name: "url", type: "url", required: true },
          { name: "date", type: "date", required: true },
          { name: "author", type: "text" },
          {
            name: "lang",
            type: "select",
            required: true,
            options: [opt("en"), opt("pt")],
          },
          { name: "topic", type: "text", required: true },
          { name: "summary", type: "long-text", required: true },
          { name: "quote", type: "long-text" },
        ],
      },
    },
    presskit: {
      mediaDir: "public/images/press",
      schema: {
        collection: "presskit",
        label: "Press Kit Photos",
        fields: [
          { name: "file", type: "text", required: true },
          { name: "caption", type: "text", required: true },
        ],
      },
    },
    /**
     * One question per entry, answered so the answer survives being lifted out
     * of the page. `layout` picks which block sustains it; the others stay empty.
     * Numbers are written as {talkCount}, {npmDownloads} and friends, and filled
     * from the other collections at build time by src/lib/faq.ts.
     */
    faq: {
      schema: {
        collection: "faq",
        label: "FAQ",
        fields: [
          { name: "slug", type: "text", required: true },
          { name: "category", type: "text", required: true },
          {
            name: "layout",
            type: "select",
            required: true,
            options: [
              opt("profile"),
              opt("evidence"),
              opt("matrix"),
              opt("steps"),
              opt("service"),
            ],
          },
          { name: "question", type: "text", required: true },
          { name: "answer", type: "long-text", required: true },
          { name: "body", type: "long-text" },
          {
            name: "facts",
            type: "array",
            itemFields: [
              { name: "label", type: "text", required: true },
              { name: "value", type: "text", required: true },
            ],
          },
          {
            name: "evidence",
            type: "array",
            itemFields: [
              { name: "date", type: "text", required: true },
              { name: "title", type: "text", required: true },
              { name: "detail", type: "long-text", required: true },
              { name: "href", type: "text" },
            ],
          },
          {
            name: "matrix",
            type: "array",
            itemFields: [
              { name: "item", type: "text", required: true },
              { name: "where", type: "text", required: true },
              { name: "proof", type: "text", required: true },
              { name: "href", type: "text" },
            ],
          },
          {
            name: "steps",
            type: "array",
            itemFields: [
              { name: "title", type: "text", required: true },
              { name: "detail", type: "long-text", required: true },
            ],
          },
          {
            name: "offering",
            type: "array",
            itemFields: [
              { name: "title", type: "text", required: true },
              { name: "detail", type: "long-text", required: true },
            ],
          },
          {
            name: "links",
            type: "array",
            itemFields: [
              { name: "label", type: "text", required: true },
              { name: "href", type: "text", required: true },
            ],
          },
          { name: "related", type: "array", itemFields: [{ name: "slug", type: "text", required: true }] },
          { name: "seoTitle", type: "text" },
          { name: "seoDescription", type: "text" },
        ],
      },
    },
    business: {
      schema: {
        collection: "business",
        label: "Company (/business)",
        fields: [
          { name: "legalName", type: "text", required: true },
          { name: "tradeName", type: "text", required: true },
          { name: "cnpj", type: "text", required: true },
          { name: "foundedAt", type: "text", required: true },
          { name: "cnpjOpenedAt", type: "text", required: true },
          { name: "city", type: "text", required: true },
          { name: "region", type: "text", required: true },
          { name: "country", type: "text", required: true },
          { name: "eyebrow", type: "text", required: true },
          { name: "headline", type: "text", required: true },
          { name: "lede", type: "long-text", required: true },
          { name: "chips", type: "array", itemFields: [{ name: "value", type: "text", required: true }] },
          { name: "heroRecordLabel", type: "text", required: true },
          { name: "trackTitle", type: "text", required: true },
          { name: "track", type: "long-text", required: true },
          { name: "proofTitle", type: "text", required: true },
          { name: "proofNote", type: "long-text", required: true },
          {
            name: "proof",
            type: "array",
            itemFields: [
              { name: "value", type: "text", required: true },
              { name: "label", type: "text", required: true },
              { name: "detail", type: "long-text", required: true },
              { name: "href", type: "text", required: true },
            ],
          },
          { name: "offeringsTitle", type: "text", required: true },
          { name: "offeringsNote", type: "long-text", required: true },
          {
            name: "offerings",
            type: "array",
            itemFields: [
              { name: "code", type: "text", required: true },
              {
                name: "icon",
                type: "select",
                options: [opt("Smartphone"), opt("Package"), opt("Shield")],
              },
              { name: "title", type: "text", required: true },
              { name: "description", type: "long-text", required: true },
              { name: "bullets", type: "array", itemFields: [{ name: "value", type: "text", required: true }] },
              { name: "href", type: "text", required: true },
              { name: "linkLabel", type: "text", required: true },
            ],
          },
          { name: "audienceTitle", type: "text", required: true },
          { name: "audienceNote", type: "long-text", required: true },
          {
            name: "audience",
            type: "array",
            itemFields: [
              { name: "title", type: "text", required: true },
              { name: "detail", type: "long-text", required: true },
            ],
          },
          { name: "stackTitle", type: "text", required: true },
          { name: "stackNote", type: "long-text", required: true },
          { name: "processTitle", type: "text", required: true },
          { name: "processNote", type: "long-text", required: true },
          {
            name: "process",
            type: "array",
            itemFields: [
              { name: "title", type: "text", required: true },
              { name: "detail", type: "long-text", required: true },
            ],
          },
          { name: "registryTitle", type: "text", required: true },
          { name: "registryNote", type: "long-text", required: true },
          { name: "registryLinkLabel", type: "text", required: true },
          { name: "registryLinkHref", type: "url", required: true },
          {
            name: "registry",
            type: "array",
            itemFields: [
              { name: "label", type: "text", required: true },
              { name: "value", type: "long-text", required: true },
            ],
          },
          { name: "contactTitle", type: "text", required: true },
          { name: "contactDetail", type: "long-text", required: true },
          { name: "contactNote", type: "long-text", required: true },
          { name: "contactEmailLabel", type: "text", required: true },
          { name: "contactLinkedInLabel", type: "text", required: true },
          { name: "seoTitle", type: "text" },
          { name: "seoDescription", type: "long-text" },
        ],
      },
    },
    llms: {
      schema: {
        collection: "llms",
        label: "AI Index (llms.txt)",
        fields: [
          { name: "title", type: "text", required: true },
          { name: "summary", type: "long-text", required: true },
          { name: "note", type: "long-text", required: true },
          {
            name: "pages",
            type: "array",
            required: true,
            itemFields: [
              { name: "path", type: "text", required: true },
              { name: "title", type: "text", required: true },
              { name: "description", type: "long-text", required: true },
            ],
          },
        ],
      },
    },
    sitemap: {
      schema: {
        collection: "sitemap",
        label: "Sitemap Page",
        fields: [
          { name: "title", type: "text", required: true },
          { name: "description", type: "long-text", required: true },
          {
            name: "sections",
            type: "array",
            required: true,
            itemFields: [
              { name: "file", type: "text", required: true },
              { name: "title", type: "text", required: true },
              { name: "description", type: "long-text", required: true },
            ],
          },
        ],
      },
    },
    testimonials: {
      schema: {
        collection: "testimonials",
        label: "Testimonials",
        fields: [
          { name: "name", type: "text", required: true },
          { name: "role", type: "text", required: true },
          { name: "company", type: "text", required: true },
          { name: "quote", type: "long-text", required: true },
          { name: "avatar", type: "url" },
          {
            name: "icon",
            type: "select",
            options: [opt("Trophy"), opt("Github"), opt("Mic")],
          },
        ],
      },
    },
  },
};

export default config;
