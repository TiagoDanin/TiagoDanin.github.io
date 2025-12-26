import { Projects } from "@/components/sections/Projects";
import { FullProjects } from "@/components/sections/FullProjects";

export const metadata = {
  title: "Developer Portfolio - Projects & Open Source",
  description: "Explore my portfolio of 20+ projects: open source libraries, Flutter & React Native apps, npm packages, and mobile games. iOS, Android, TypeScript, Kotlin.",
  keywords: ["projects", "portfolio", "open source", "GitHub", "NPM", "Flutter", "React Native", "mobile apps", "TypeScript", "Kotlin", "Swift", "developer portfolio", "games"],
  alternates: {
    canonical: 'https://tiagodanin.com/projects',
    types: {
      'application/rss+xml': [
        { url: '/rss/projects.xml', title: 'Projects RSS Feed' }
      ],
    },
  },
  openGraph: {
    title: "Developer Portfolio - 300+ Projects & Open Source",
    description: "Explore my portfolio of 20+ projects: open source libraries, Flutter & React Native apps, npm packages, and mobile games.",
    url: "https://tiagodanin.com/projects",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Developer Portfolio - 300+ Projects",
    description: "Open source libraries, Flutter apps, React Native projects, npm packages, and mobile games.",
  },
  other: {
    'application/ld+json': JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "name": "Developer Portfolio - 300+ Projects",
        "description": "Comprehensive portfolio of open source projects and applications",
        "url": "https://tiagodanin.com/projects",
        "mainEntity": {
          "@type": "Person",
          "name": "Tiago Danin",
          "url": "https://tiagodanin.com",
          "hasOccupation": {
            "@type": "Occupation",
            "name": "Mobile Application Developer",
            "description": "Specializes in Flutter, React Native, and native development"
          }
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://tiagodanin.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Projects",
            "item": "https://tiagodanin.com/projects"
          }
        ]
      }
    ])
  }
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