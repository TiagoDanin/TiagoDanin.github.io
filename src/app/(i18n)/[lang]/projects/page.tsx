import type { Metadata } from "next";
import Link from 'next/link';
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { queryCollection } from 'nextjs-studio/server';
import { Github, Package, Smartphone, ArrowRight } from 'lucide-react';

import { Projects } from "@/components/sections/Projects";
import { FullProjects } from "@/components/sections/FullProjects";
import type { ProjectForCard } from "@/components/sections/FullProjects";
import { Card, CardContent } from '@/components/ui/card';
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphLocale, pageUrl } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/projects'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  const alternates = localeAlternates(locale, '/projects');

  return {
    title: t(i18n)`Projects - 250+ Open Source & NPM Packages`,
    description: t(
      i18n
    )`Browse 250+ projects: 70+ npm packages, Flutter & React Native apps, GitHub tools, and mobile games. Open source libraries used by thousands of developers worldwide.`,
    alternates: {
      ...alternates,
      types: {
        ...markdownAlternate('/projects'),
        'application/rss+xml': [{ url: '/rss/projects.xml', title: 'Projects RSS Feed' }],
      },
    },
    openGraph: {
      title: t(i18n)`250+ Open Source Projects - NPM Packages, Flutter Apps & Tools`,
      description: t(
        i18n
      )`Browse 250+ projects including 70+ npm packages, Flutter apps, React Native projects, and developer tools. Open source libraries used worldwide.`,
      url: pageUrl(locale, '/projects'),
      type: "website",
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: t(i18n)`250+ Open Source Projects | Tiago Danin`,
      description: t(
        i18n
      )`70+ npm packages, Flutter apps, React Native projects, and developer tools. Browse the full portfolio.`,
    },
    other: {
      'application/ld+json': JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "name": t(i18n)`Developer Portfolio - 300+ Projects`,
          "description": t(i18n)`Comprehensive portfolio of open source projects and applications`,
          "url": pageUrl(locale, '/projects'),
          "mainEntity": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/'),
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
            { "@type": "ListItem", "position": 1, "name": "Home", "item": pageUrl(locale, '/') },
            { "@type": "ListItem", "position": 2, "name": "Projects", "item": pageUrl(locale, '/projects') }
          ]
        }
      ])
    }
  };
}

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

const ProjectsPage = async ({ params }: PageProps<'/[lang]/projects'>) => {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const projectsData = queryCollection('projects').locale(locale);

  // Section titles are registry names and stay as they are. The last two
  // describe rather than name, so they are translated.
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
    { title: "NPM", projects: toCards(queryCollection('npm'), p => `https://www.npmjs.com/package/${p.name}`) },
    { title: "LuaRocks", projects: toCards(queryCollection('luarocks'), p => `https://luarocks.org/modules/tiagodanin/${p.name}`) },
    { title: "Pypi", projects: toCards(queryCollection('pypi'), p => `https://pypi.python.org/pypi/${p.name}`) },
    { title: "Atom", projects: toCards(queryCollection('atom'), p => `https://atom.io/packages/${p.name}`) },
    { title: "Microsoft Store", projects: toCards(queryCollection('windows'), p => p.url ?? null) },
    { title: "AUR Archlinux", projects: toCards(queryCollection('aur'), p => p.url ?? null) },
    { id: "private", title: t(i18n)`Private`, projects: toCards(queryCollection('private'), p => p.url ?? null) },
    { title: t(i18n)`Offline/Old Websites`, projects: toCards(queryCollection('offline'), () => null) },
  ];

  return (
    <div>
      <Projects projects={[...projectsData]} />

      <section className="container mx-auto px-4 -mt-20 mb-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900"><Trans>Explore</Trans></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/rankings/github">
            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer h-full">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                  <Github className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold"><Trans>GitHub Rankings</Trans></p>
                  <p className="text-sm text-muted-foreground mt-0.5"><Trans>Top repos by stars &amp; forks</Trans></p>
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
                  <p className="font-semibold"><Trans>NPM Rankings</Trans></p>
                  <p className="text-sm text-muted-foreground mt-0.5"><Trans>Most downloaded packages</Trans></p>
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
                  <p className="font-semibold"><Trans>Android Apps</Trans></p>
                  <p className="text-sm text-muted-foreground mt-0.5"><Trans>Published on Google Play</Trans></p>
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

export default ProjectsPage;
