import type { StudioConfig } from "nextjs-studio";

const opt = (value: string) => ({ label: value, value });

const config: StudioConfig = {
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
