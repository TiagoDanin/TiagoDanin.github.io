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
              { name: "color", type: "text", required: true },
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
      schema: {
        collection: "posts",
        label: "Blog Posts",
        fields: [
          { name: "title", type: "text", required: true },
          { name: "date", type: "text", required: true },
          { name: "description", type: "long-text", required: true },
          { name: "slug", type: "text", required: true },
          { name: "originalUrl", type: "url", required: true },
          {
            name: "lang",
            type: "select",
            required: true,
            options: [opt("en"), opt("pt")],
          },
          {
            name: "tags",
            type: "multi-select",
            required: true,
            options: [
              opt("JavaScript"), opt("React"), opt("Flutter"), opt("Android"),
              opt("iOS"), opt("AI"), opt("GitHub"), opt("DevOps"), opt("Mobile"),
              opt("Web"), opt("Security"), opt("Tutorial"), opt("Performance"),
              opt("UI/UX"), opt("Testing"), opt("Backend"), opt("Frontend"),
              opt("Tools"), opt("Career"), opt("Linux"), opt("Video"), opt("Article"),
            ],
          },
        ],
      },
    },
    github: {
      scripts: {
        sync: "tsx scripts/getProjectsGithub.ts",
      },
    },
    npm: {
      scripts: {
        sync: "tsx scripts/getProjectsNPM.ts",
      },
    },
  },
};

export default config;
