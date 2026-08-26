import { Metadata } from 'next';
import Link from 'next/link';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { queryCollection } from 'nextjs-studio/server';
import { titleToSlug } from '@/utils/parse';
import { Badge } from '@/components/ui/badge';
import { localePath } from '@/lib/i18n/locales';
import { getI18nInstance, initI18n, resolveLocale } from '@/lib/i18n/server';
import { localeAlternates, markdownAlternate, openGraphLocale, pageUrl } from '@/lib/i18n/seo';

interface SkillItem {
  name: string;
  icon: string;
  color: string;
}

interface SkillsEntry {
  category: string;
  items: SkillItem[];
}

export async function generateMetadata({ params }: PageProps<'/[lang]/skills'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Technical Skills | Tiago Danin`,
    description: t(i18n)`Full overview of Tiago Danin's technical skills: Flutter, React Native, Swift, Kotlin, Node.js, TypeScript, DevOps, and more. Hire for mobile development, web, and consulting.`,
    keywords: ['skills', 'developer', 'Flutter', 'React Native', 'mobile developer', 'freelance', 'Tiago Danin'],
    alternates: {
      ...localeAlternates(locale, '/skills'),
      types: markdownAlternate('/skills'),
    },
    openGraph: {
      title: t(i18n)`Technical Skills, Tiago Danin`,
      description: t(i18n)`Expert mobile and full-stack developer. Flutter, React Native, Swift, Kotlin, Node.js, TypeScript, and more.`,
      url: pageUrl(locale, '/skills'),
      type: 'profile',
      siteName: 'Tiago Danin',
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary',
      title: t(i18n)`Technical Skills | Tiago Danin`,
      description: t(i18n)`Flutter, React Native, Swift, Kotlin, Node.js, TypeScript, see all skills.`,
      creator: '@tiagodanin',
    },
  };
}

export default async function SkillsPage({ params }: PageProps<'/[lang]/skills'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const skills = [...queryCollection('skills').locale(locale)] as SkillsEntry[];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": t(i18n)`Technical Skills, Tiago Danin`,
    "numberOfItems": skills.reduce((acc, cat) => acc + cat.items.length, 0),
    "itemListElement": skills.flatMap((cat, ci) =>
      cat.items.map((item, ii) => ({
        "@type": "ListItem",
        "position": ci * 100 + ii + 1,
        "name": item.name,
        "url": `${pageUrl(locale, '/skills')}${titleToSlug(item.name)}/`,
      }))
    ),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`Skills`, "item": pageUrl(locale, '/skills') },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="container mx-auto py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight"><Trans>Technical Skills</Trans></h1>
            <p className="mt-4 text-muted-foreground">
              <Trans>Technologies and tools I work with across mobile, web, backend, and design.</Trans>
            </p>
          </header>

          <div className="space-y-8">
            {skills.map((category) => (
              <section key={category.category}>
                <h2 className="text-lg font-semibold mb-3">{category.category}</h2>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <Link key={item.name} href={localePath(locale, `/skills/${titleToSlug(item.name)}`)}>
                      <Badge
                        variant="outline"
                        className="px-3 py-1.5 text-sm hover:bg-secondary transition-colors"
                      >
                        {item.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
