import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Youtube, Presentation, MessageCircle, AlignJustify } from "lucide-react";
import { queryCollection } from 'nextjs-studio/server';
import type { Metadata } from "next";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";

import { HTML_LANG, localePath } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, markdownAlternate, openGraphLocale, pageUrl } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/links'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Link in Bio - All Contacts & Profiles`,
    description: t(
      i18n
    )`All my important links in one place - Social media, presentations, portfolio, and contact information for Tiago Danin.`,
    keywords: ["links", "social media", "contact", "portfolio", "linktree", "bio", "Tiago Danin"],
    alternates: {
      ...localeAlternates(locale, '/links'),
      types: markdownAlternate('/links'),
    },
    openGraph: {
      title: t(i18n)`Links - Tiago Danin`,
      description: t(i18n)`All my important links in one place - Social media, presentations, and contact information.`,
      url: pageUrl(locale, '/links'),
      type: "profile",
      ...openGraphLocale(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title: t(i18n)`Links - Tiago Danin`,
      description: t(i18n)`All my important links in one place.`,
    },
  };
}

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  presentation: Presentation,
  whatsapp: MessageCircle,
  list: AlignJustify,
};

interface LinkEntry {
  title: string;
  url: string;
  enabled?: unknown;
}

export default async function Links({ params }: PageProps<'/[lang]/links'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  const linksData = queryCollection('links');

  // Only the links the page actually renders belong in the graph.
  const active = ([...linksData] as unknown as LinkEntry[]).filter((l) => l.enabled);
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": t(i18n)`Link in Bio, Tiago Danin`,
    "url": pageUrl(locale, '/links'),
    "inLanguage": HTML_LANG[locale],
    "mainEntity": {
      "@type": "Person",
      "name": "Tiago Danin",
      "url": pageUrl(locale, '/'),
      "sameAs": active.map((l) => l.url).filter(Boolean),
    },
    "hasPart": {
      "@type": "ItemList",
      "numberOfItems": active.length,
      "itemListElement": active.map((l, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": l.title,
        "url": l.url,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="max-w-md mx-auto">
            {/* Profile Section */}
            <div className="text-center mb-8">
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-white shadow-lg">
                <AvatarImage src="https://avatars.githubusercontent.com/u/5731176?v=4" alt="Tiago Danin" />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-green-400 to-emerald-400 text-white">
                  TD
                </AvatarFallback>
              </Avatar>

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Tiago Danin
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                <Trans>Mobile Developer • Bug Hunter</Trans>
              </p>
            </div>

            {/* Links Section */}
            <div className="space-y-4">
              {linksData.filter((link) => link.enabled).map((link, index) => {
                const IconComponent = iconMap[link.icon as keyof typeof iconMap];
                const needsFeedback = Boolean(link.talk_avaliation);
                const href = needsFeedback
                  ? `${localePath(locale, '/links/talk')}/?talk=${encodeURIComponent(link.title as string)}&bonus=${encodeURIComponent(link.url as string)}`
                  : (link.url as string);

                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full min-h-14 h-auto whitespace-normal bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800"
                    asChild
                  >
                    <a
                      href={href}
                      target={needsFeedback ? undefined : "_blank"}
                      rel={needsFeedback ? undefined : "noopener noreferrer"}
                      className="flex items-center justify-between px-6 py-3 gap-3 w-full"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300 shrink-0" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white text-left break-words">
                          {link.title}
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        {needsFeedback ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        )}
                      </svg>
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
