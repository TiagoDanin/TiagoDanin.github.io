import type { Metadata } from "next";
import { t } from "@lingui/core/macro";

import { CallToAction } from "@/components/sections/CallToAction";
import { LanguageSuggestion } from "@/components/ui/LanguageSuggestion";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { RecentPosts } from "@/components/sections/RecentPosts";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";
import { queryCollection } from 'nextjs-studio/server';
import { getCallToActionData, getHeroData, getTestimonialsData } from '@/lib/sections';
import { contentLang, DEFAULT_LOCALE, HTML_LANG, localePath } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphDefaults, ORIGIN, pageUrl, twitterDefaults } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  const alternates = localeAlternates(locale, '/');

  return {
    // `title.template` skips the segment that declares it, so the home page
    // carries its own brand and its own length budget.
    title: t(i18n)`Tiago Danin - Mobile Developer | Flutter & React Native`,
    description: t(
      i18n
    )`Mobile developer with 250+ projects and 70+ open source packages. Specializing in Flutter, React Native, iOS & Android. Bug hunter on HackerOne.`,
    // The mirror is English-only, and both languages point at it: the sitemap
    // says the same, and the two must not disagree.
    alternates: { ...alternates, types: markdownAlternate('/') },
    openGraph: {
      title: t(i18n)`Tiago Danin - Mobile Developer | 250+ Projects & 70+ Open Source Packages`,
      description: t(
        i18n
      )`Flutter, React Native, iOS & Android developer. 250+ projects delivered, bug hunter on HackerOne, and open source contributor.`,
      url: pageUrl(locale, '/'),
      type: 'website',
      ...openGraphDefaults(locale),
    },
    twitter: {
      ...twitterDefaults(),
      title: t(i18n)`Tiago Danin - Mobile Developer | Flutter & React Native`,
      description: t(
        i18n
      )`250+ projects, 70+ open source packages. Flutter, React Native, iOS & Android. Bug hunter on HackerOne.`,
      creator: '@tiagodanin',
    },
  };
}

const Index = async ({ params }: PageProps<'/[lang]'>) => {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const posts = [...queryCollection('posts').where({ lang: contentLang(locale) })].sort((a, b) => b.date.localeCompare(a.date));
  const projectsData = queryCollection('projects').locale(locale);
  const workData = queryCollection('work').locale(locale);
  const volunteerData = queryCollection('volunteer').locale(locale);
  const skillsData = queryCollection('skills').locale(locale);
  const aboutData = queryCollection('about').locale(locale).one();
  // The links come from contents/expertise as bare routes, so they are resolved
  // here rather than in the component: the page reads, the component draws.
  // Passed raw, the Portuguese home linked its four expertise cards at the
  // English pages.
  const expertiseData = [...queryCollection('expertise').locale(locale)].map((item) => ({
    ...item,
    link: item.link ? localePath(locale, String(item.link)) : item.link,
  }));

  const hero = getHeroData(locale);
  const recognition = getTestimonialsData(locale);
  const contact = getCallToActionData(locale);

  const homeSchema = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Tiago Danin",
      "url": pageUrl(locale, '/'),
      "description": "Personal website and portfolio of Tiago Danin, Mobile Developer",
      "author": { "@type": "Person", "name": "Tiago Danin" },
      "inLanguage": HTML_LANG[locale],
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${ORIGIN}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <Hero about={hero.about} stats={hero.stats} socialLinks={hero.socialLinks} locale={locale} />
      <Services expertise={expertiseData} />
      <Projects projects={[...projectsData]} locale={locale} />
      <Testimonials testimonials={recognition.testimonials} tokens={recognition.tokens} />
      <RecentPosts posts={[...posts]} />
      <Work work={[...workData]} volunteer={[...volunteerData]} skills={[...skillsData]} about={aboutData} />
      <CallToAction email={contact.email} linkedInUrl={contact.linkedInUrl} />

      {/* Only on the English home: on /br the reader is already where this
          would send them. */}
      {locale === DEFAULT_LOCALE && <LanguageSuggestion href={localePath('br', '/')} />}
    </>
  );
};

export default Index;
