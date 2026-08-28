import { Suspense } from "react";
import type { Metadata } from "next";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import FeedbackForm from "@/components/sections/FeedbackForm";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates } from "@/lib/i18n/seo";

export async function generateMetadata({ params }: PageProps<'/[lang]/links/talk'>): Promise<Metadata> {
  const locale = resolveLocale((await params).lang);
  const i18n = getI18nInstance(locale);

  return {
    title: t(i18n)`Feedback da Talk`,
    description: t(i18n)`Compartilhe seu feedback sobre a talk e receba o bônus de acesso ao material complementar.`,
    alternates: localeAlternates(locale, '/links/talk'),
    robots: { index: false, follow: false },
  };
}

export default async function TalkFeedbackPage({ params }: PageProps<'/[lang]/links/talk'>) {
  const locale = resolveLocale((await params).lang);
  const i18n = initI18n(locale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              <Trans>Feedback da talk</Trans>
            </h1>
            <Suspense fallback={<div className="text-gray-500">{t(i18n)`Carregando...`}</div>}>
              <FeedbackForm locale={locale} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
