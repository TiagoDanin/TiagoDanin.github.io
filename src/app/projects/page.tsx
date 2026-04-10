import { Projects } from "@/components/sections/Projects";
import { FullProjects } from "@/components/sections/FullProjects";
import type { ProjectForCard } from "@/components/sections/FullProjects";
import { queryCollection } from 'nextjs-studio/server';
import Link from 'next/link';
import { Github, Package, Smartphone, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
      projects: queryCollection('googleplay').map(p => ({
        title: p.name,
        description: p.description,
        href: `/app/${p.slug}`,
      })),
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

      <section className="container mx-auto px-4 -mt-20 mb-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Explore</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/rankings/github">
            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                  <Github className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">GitHub Rankings</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Top repos by stars & forks</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/rankings/npm">
            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                  <Package className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">NPM Rankings</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Most downloaded packages</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/apps">
            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Android Apps</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Published on Google Play</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      <FullProjects projectSections={projectSections} />
    </div>
  );
};

export default Index;
