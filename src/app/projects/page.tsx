import { Projects } from "@/components/sections/Projects";
import { FullProjects } from "@/components/sections/FullProjects";
import type { ProjectForCard } from "@/components/sections/FullProjects";
import { queryCollection } from 'nextjs-studio/server';

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

function toCards(
  items: Array<{ name: string; description: string; url?: string }>,
  getHref: (item: { name: string; description: string; url?: string }) => string | null
): ProjectForCard[] {
  return items.map(item => ({
    title: item.name,
    description: item.description || '',
    href: getHref(item),
  }));
}

const Index = () => {
  const projectsData = queryCollection('projects');

  const projectSections = [
    {
      title: "GitHub",
      projects: queryCollection('github').map(p => ({
        title: p.name,
        description: p.description || '',
        href: p.homepage || p.html_url || null,
        archived: p.archived,
      })),
    },
    {
      title: "Google Play",
      projects: toCards(queryCollection('googleplay'), p => p.url ?? null),
    },
    {
      title: "NPM",
      projects: toCards(queryCollection('npm'), p => `https://www.npmjs.com/package/${p.name}`),
    },
    {
      title: "LuaRocks",
      projects: toCards(queryCollection('luarocks'), p => `https://luarocks.org/modules/tiagodanin/${p.name}`),
    },
    {
      title: "Pypi",
      projects: toCards(queryCollection('pypi'), p => `https://pypi.python.org/pypi/${p.name}`),
    },
    {
      title: "Atom",
      projects: toCards(queryCollection('atom'), p => `https://atom.io/packages/${p.name}`),
    },
    {
      title: "Microsoft Store",
      projects: toCards(queryCollection('windows'), p => p.url ?? null),
    },
    {
      title: "AUR Archlinux",
      projects: toCards(queryCollection('aur'), p => p.url ?? null),
    },
    {
      title: "Private",
      projects: toCards(queryCollection('private'), p => p.url ?? null),
    },
    {
      title: "Offline/Old Websites",
      projects: toCards(queryCollection('offline'), () => null),
    },
  ];

  return (
    <div>
      <Projects projects={[...projectsData]} />
      <FullProjects projectSections={projectSections} />
    </div>
  );
};

export default Index;
