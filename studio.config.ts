import type { StudioConfig } from "nextjs-studio";

const config: StudioConfig = {
  collections: {
    github: {
      scripts: {
        import: "tsx scripts/getProjectsGithub.ts",
        sync: "tsx scripts/getProjectsGithub.ts",
      },
    },
    npm: {
      scripts: {
        import: "tsx scripts/getProjectsNPM.ts",
        sync: "tsx scripts/getProjectsNPM.ts",
      },
    },
  },
};

export default config;
