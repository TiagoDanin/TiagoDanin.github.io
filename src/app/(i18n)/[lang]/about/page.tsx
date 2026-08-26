import type { Metadata } from "next";
import { t } from "@lingui/core/macro";

import { CallToAction } from "@/components/sections/CallToAction";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Milestones } from "@/components/sections/Milestones";
import { PressMentions } from "@/components/sections/PressMentions";
import { queryCollection } from 'nextjs-studio/server';
import { getPressItems, pressDate } from "@/lib/press";
import { getCallToActionData, getHeroData } from "@/lib/sections";
import { DEFAULT_LOCALE, HTML_LANG } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphLocale, ORIGIN, pageUrl } from "@/lib/i18n/seo";

interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  tags: string[];
}

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  const alternates = localeAlternates(locale, '/about');

  return {
    title: t(i18n)`About - Flutter, React Native & Bug Hunter`,
    description: t(
      i18n
    )`Mobile developer with 8+ years of experience in Flutter, React Native & native iOS/Android. Bug hunter on HackerOne, 70+ npm packages, 18+ conference talks. Based in Brazil.`,
    // The mirror is English-only, and both languages point at it: the sitemap
    // says the same, and the two must not disagree.
    alternates: { ...alternates, types: markdownAlternate('/about') },
    openGraph: {
      title: t(i18n)`Tiago Danin - Mobile Developer & Bug Hunter`,
      description: t(
        i18n
      )`Mobile developer specializing in Flutter, React Native & native iOS/Android. Open source contributor, security researcher, and mentor.`,
      url: pageUrl(locale, '/about'),
      type: "profile",
      ...openGraphLocale(locale),
      // Flat, not nested under `profile`: Next types og:profile that way, and
      // the nested form this page carried before was silently dropped, so the
      // og:profile:* tags never reached the HTML.
      firstName: "Tiago",
      lastName: "Danin",
      username: "tiagodanin",
    },
    twitter: {
      card: 'summary_large_image',
      title: t(i18n)`About Tiago Danin - Mobile Developer`,
      description: t(
        i18n
      )`Flutter expert, React Native developer, security researcher & bug hunter. Open source advocate.`,
      creator: '@tiagodanin',
      site: '@tiagodanin',
    },
  };
}

const About = async ({ params }: PageProps<'/[lang]/about'>) => {
  const locale = resolveLocale((await params).lang);
  initI18n(locale);

  const workData = queryCollection('work').locale(locale);
  const volunteerData = queryCollection('volunteer').locale(locale);
  const skillsData = queryCollection('skills').locale(locale);
  const aboutData = queryCollection('about').locale(locale).one();

  const hero = getHeroData(locale);
  const contact = getCallToActionData(locale);

  // Milestones and press are what this page has that the home does not: the
  // home sells what he builds, /about backs it with a record.
  const milestones = ([...queryCollection('timeline')] as unknown as TimelineEntry[])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);
  const pressItems = getPressItems().slice(0, 3).map((item) => ({
    outlet: item.outlet,
    title: item.title,
    url: item.url,
    date: item.date,
    displayDate: pressDate(item.date, locale),
  }));

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "inLanguage": HTML_LANG[locale],
        "mainEntity": {
          "@type": "Person",
          "name": "Tiago Danin",
          "url": `${ORIGIN}/`,
          "image": "https://avatars.githubusercontent.com/u/5731176?v=4",
          "description": "Full-stack mobile developer specializing in Flutter, React Native, and native iOS/Android development",
          "jobTitle": "Mobile Developer & Security Researcher",
          "worksFor": {
            "@type": "Organization",
            "name": "Freelance / Independent"
          },
          "sameAs": [
            "https://github.com/TiagoDanin",
            "https://twitter.com/tiagodanin",
            "https://linkedin.com/in/tiagodanin",
            "https://hackerone.com/tiago-danin"
          ],
          "knowsAbout": [
            "Flutter",
            "React Native",
            "Swift",
            "Kotlin",
            "iOS Development",
            "Android Development",
            "Cybersecurity",
            "DevOps"
          ],
          "skills": [
            "Mobile Application Development",
            "Cross-platform Development",
            "Security Testing",
            "Open Source Development"
          ],
          "hasOccupation": {
            "@type": "Occupation",
            "name": "Mobile Application Developer",
            "occupationLocation": {
              "@type": "Country",
              "name": "Brazil"
            },
            "description": "Develops mobile applications using Flutter, React Native, and native iOS/Android technologies"
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": pageUrl(locale, '/')
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About",
            "item": pageUrl(locale, '/about')
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <Hero
        about={hero.about}
        stats={hero.stats}
        socialLinks={hero.socialLinks}
        showPressKit
      />
      <Work work={[...workData]} volunteer={[...volunteerData]} skills={[...skillsData]} about={aboutData} />

      <Milestones milestones={milestones} />

      <PressMentions items={pressItems} />

      <CallToAction email={contact.email} linkedInUrl={contact.linkedInUrl} />
    </>
  );
};

export default About;
