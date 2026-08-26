import type { Metadata } from "next";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { queryCollection } from 'nextjs-studio/server';
import {
  ExternalLink,
  Home,
  Image as Gallery,
  Camera,
  Github,
  User,
  Twitter,
  Gamepad2,
  MessageCircle,
  Rocket,
  Globe,
  Package,
  Linkedin,
  Mail,
  Timer,
  LayoutTemplate,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { HTML_LANG } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphLocale, pageUrl } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/all-contacts'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`All Contacts - GitHub, NPM, LinkedIn & More`,
    description: t(
      i18n
    )`All contact methods and social media profiles for Tiago Danin. Connect on GitHub, LinkedIn, Twitter, and more professional platforms.`,
    keywords: ["contacts", "social media", "GitHub", "LinkedIn", "Twitter", "email", "contact", "networking"],
    alternates: {
      ...localeAlternates(locale, '/all-contacts'),
      types: markdownAlternate('/all-contacts'),
    },
    openGraph: {
      title: t(i18n)`All Contacts - Tiago Danin`,
      description: t(
        i18n
      )`All contact methods and social media profiles. Connect on GitHub, LinkedIn, Twitter, and more.`,
      url: pageUrl(locale, '/all-contacts'),
      type: "profile",
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: t(i18n)`All Contacts - Tiago Danin`,
      description: t(i18n)`All contact methods and social media profiles.`,
    },
  };
}

const iconMap: Record<string, LucideIcon> = {
  'ti-home': Home,
  'ti-gallery': Gallery,
  'ti-camera': Camera,
  'ti-github': Github,
  'ti-user': User,
  'ti-reddit': Globe,
  'ti-twitter-alt': Twitter,
  'ti-game': Gamepad2,
  'ti-microsoft-alt': Globe,
  'ti-linux': Globe,
  'ti-comment': MessageCircle,
  'ti-rocket': Rocket,
  'ti-world': Globe,
  'ti-package': Package,
  'ti-stack-overflow': Globe,
  'ti-linkedin': Linkedin,
  'ti-email': Mail,
  'ti-timer': Timer,
  'ti-layout-tab': LayoutTemplate,
};

interface ContactEntry {
  url: string;
  label: string;
}

export default async function AllContactsPage({ params }: PageProps<'/[lang]/all-contacts'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const contacts = queryCollection('contacts');

  // The page is a list of profiles elsewhere, so the graph says exactly that:
  // one ProfilePage whose subject is the Person, listing every account as sameAs.
  const entries = [...contacts] as unknown as ContactEntry[];
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": t(i18n)`All Contacts, Tiago Danin`,
    "url": pageUrl(locale, '/all-contacts'),
    "inLanguage": HTML_LANG[locale],
    "mainEntity": {
      "@type": "Person",
      "name": "Tiago Danin",
      "url": pageUrl(locale, '/'),
      "sameAs": entries.map((c) => c.url).filter(Boolean),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
      { "@type": "ListItem", "position": 2, "name": t(i18n)`All Contacts`, "item": pageUrl(locale, '/all-contacts') },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <div className="relative py-32 px-4 container mx-auto overflow-hidden">
      {/* Blur background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-center"><Trans>All Contacts</Trans></h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {contacts.map((contact) => {
            const LucideIcon = iconMap[contact.icon] || Globe;
            return (
              <a
                key={contact.url}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center gap-2"
              >
                <LucideIcon className="text-4xl mb-1" />
                <span className="font-medium text-lg">{contact.label}</span>
                <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}
