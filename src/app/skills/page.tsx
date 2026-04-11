import { Metadata } from 'next';
import Link from 'next/link';
import { queryCollection } from 'nextjs-studio/server';
import { titleToSlug } from '@/utils/parse';
import { Badge } from '@/components/ui/badge';

interface SkillItem {
  name: string;
  icon: string;
  color: string;
}

interface SkillsEntry {
  category: string;
  items: SkillItem[];
}

export const metadata: Metadata = {
  title: 'Technical Skills | Tiago Danin',
  description: 'Full overview of Tiago Danin\'s technical skills: Flutter, React Native, Swift, Kotlin, Node.js, TypeScript, DevOps, and more. Hire for mobile development, web, and consulting.',
  keywords: ['skills', 'developer', 'Flutter', 'React Native', 'mobile developer', 'freelance', 'Tiago Danin'],
  alternates: {
    canonical: 'https://tiagodanin.com/skills',
  },
  openGraph: {
    title: 'Technical Skills — Tiago Danin',
    description: 'Expert mobile and full-stack developer. Flutter, React Native, Swift, Kotlin, Node.js, TypeScript, and more.',
    url: 'https://tiagodanin.com/skills',
    type: 'profile',
    siteName: 'Tiago Danin',
  },
  twitter: {
    card: 'summary',
    title: 'Technical Skills | Tiago Danin',
    description: 'Flutter, React Native, Swift, Kotlin, Node.js, TypeScript — see all skills.',
    creator: '@tiagodanin',
  },
};

export default function SkillsPage() {
  const skills = [...queryCollection('skills')] as SkillsEntry[];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Technical Skills — Tiago Danin",
    "numberOfItems": skills.reduce((acc, cat) => acc + cat.items.length, 0),
    "itemListElement": skills.flatMap((cat, ci) =>
      cat.items.map((item, ii) => ({
        "@type": "ListItem",
        "position": ci * 100 + ii + 1,
        "name": item.name,
        "url": `https://tiagodanin.com/skills/${titleToSlug(item.name)}`,
      }))
    ),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tiagodanin.com" },
      { "@type": "ListItem", "position": 2, "name": "Skills", "item": "https://tiagodanin.com/skills" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="container mx-auto py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Technical Skills</h1>
            <p className="mt-4 text-muted-foreground">
              Technologies and tools I work with across mobile, web, backend, and design.
            </p>
          </header>

          <div className="space-y-8">
            {skills.map((category) => (
              <section key={category.category}>
                <h2 className="text-lg font-semibold mb-3">{category.category}</h2>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <Link key={item.name} href={`/skills/${titleToSlug(item.name)}`}>
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
