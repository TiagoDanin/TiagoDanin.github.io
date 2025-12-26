import { Projects } from "@/components/sections/Projects";
import { FullProjects } from "@/components/sections/FullProjects";

export const metadata = {
  title: "Projects",
  description: "Open source projects, mobile apps, npm packages, and GitHub repositories by Tiago Danin. Flutter, React Native, TypeScript, and more.",
  keywords: ["projects", "portfolio", "open source", "GitHub", "NPM", "Flutter", "React Native", "mobile apps", "TypeScript"],
  alternates: {
    canonical: 'https://tiagodanin.com/projects',
    types: {
      'application/rss+xml': [
        { url: '/rss/projects.xml', title: 'Projects RSS Feed' }
      ],
    },
  },
  openGraph: {
    title: "Projects Portfolio - Tiago Danin",
    description: "Open source projects, mobile apps, npm packages, and GitHub repositories. Flutter, React Native, TypeScript, and more.",
    url: "https://tiagodanin.com/projects",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Projects Portfolio - Tiago Danin",
    description: "Open source projects, mobile apps, and npm packages.",
  },
};

const Index = () => {
  return (
    <div>
      <Projects />
      <FullProjects />
    </div>
  );
};

export default Index;