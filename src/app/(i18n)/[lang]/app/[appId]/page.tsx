import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { ExternalLink, ArrowLeft, ArrowRight, CheckCircle, Lightbulb, Rocket, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { queryCollection } from "nextjs-studio/server";
import { localePath } from "@/lib/i18n/locales";
import { getI18nInstance, initI18n, resolveLocale } from "@/lib/i18n/server";
import { localeAlternates, openGraphLocale, pageUrl } from "@/lib/i18n/seo";

function getApps() {
  return [...queryCollection("googleplay")];
}

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { lang: string } }) {
  // The collection is not language-keyed: every app entry is available under
  // every locale, so both languages get the same set of slugs.
  resolveLocale(params.lang);
  const apps = getApps();
  return apps.map((app) => ({ appId: app.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/app/[appId]'>): Promise<Metadata> {
  const { lang, appId } = await params;
  const locale = resolveLocale(lang);
  const i18n = getI18nInstance(locale);
  const app = getApps().find((a) => a.slug === appId);

  if (!app) {
    return { title: t(i18n)`App Not Found` };
  }

  return {
    title: t(i18n)`${app.name} - Android App`,
    description: app.storeDescription,
    keywords: [...app.tags, "android", "google play", "tiago danin", app.name.toLowerCase()],
    alternates: localeAlternates(locale, `/app/${app.slug}`),
    openGraph: {
      title: t(i18n)`${app.name} | Android App by Tiago Danin`,
      description: app.storeDescription,
      url: pageUrl(locale, `/app/${app.slug}`),
      type: "website",
      ...openGraphLocale(locale),
    },
    twitter: {
      card: "summary_large_image",
      title: t(i18n)`${app.name} | Android App`,
      description: app.tagline,
    },
    other: {
      "application/ld+json": JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "MobileApplication",
          "name": app.name,
          "description": app.storeDescription,
          "operatingSystem": "Android",
          "applicationCategory": app.category,
          "url": app.url ?? pageUrl(locale, `/app/${app.slug}`),
          "author": {
            "@type": "Person",
            "name": "Tiago Danin",
            "url": pageUrl(locale, '/'),
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": t(i18n)`Home`, "item": pageUrl(locale, '/') },
            { "@type": "ListItem", "position": 2, "name": t(i18n)`Apps`, "item": pageUrl(locale, '/apps') },
            { "@type": "ListItem", "position": 3, "name": app.name, "item": pageUrl(locale, `/app/${app.slug}`) },
          ],
        },
      ]),
    },
  };
}

export default async function AppLandingPage({ params }: PageProps<'/[lang]/app/[appId]'>) {
  const { lang, appId } = await params;
  const locale = resolveLocale(lang);
  initI18n(locale);

  const apps = getApps();
  const app = apps.find((a) => a.slug === appId);

  if (!app) {
    notFound();
  }

  const otherApps = apps.filter((a) => a.slug !== appId).slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto max-w-5xl px-4 pt-8">
        <Link
          href={localePath(locale, "/apps")}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <Trans>All Apps</Trans>
        </Link>
      </div>

      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(ellipse at 60% 40%, ${app.accentColor} 0%, transparent 70%)`,
          }}
        />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* App icon */}
            <div
              className="text-8xl p-8 rounded-3xl shrink-0 shadow-lg"
              style={{ backgroundColor: `${app.accentColor}15`, border: `2px solid ${app.accentColor}30` }}
            >
              {app.icon}
            </div>

            {/* App info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <Badge variant="outline">{app.category}</Badge>
                <Badge variant="secondary">
                  <Trans>Android</Trans>
                </Badge>
                {app.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold">{app.name}</h1>

              <p
                className="text-xl font-medium"
                style={{ color: app.accentColor }}
              >
                {app.tagline}
              </p>

              <p className="text-muted-foreground text-lg max-w-xl">
                {app.storeDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start pt-2">
                {app.url ? (
                  <Button size="lg" asChild style={{ backgroundColor: app.accentColor, color: "#fff" }}>
                    <a href={app.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      <Trans>Download on Google Play</Trans>
                    </a>
                  </Button>
                ) : (
                  <Button size="lg" disabled variant="secondary">
                    <Trans>Coming Soon to Google Play</Trans>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl md:text-4xl font-bold">
              <Trans>What it does</Trans>
            </h2>
            <p className="text-muted-foreground text-lg">
              <Trans>Simple premise. Real value.</Trans>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {app.features.map((feature) => (
              <Card
                key={feature.title}
                className="border-2 hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6 flex gap-4">
                  <div
                    className="text-3xl p-2 rounded-xl h-fit shrink-0"
                    style={{ backgroundColor: `${app.accentColor}15` }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Build Story — the build-in-public narrative */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center space-y-3 mb-14">
            <Badge variant="secondary">
              <BookOpen className="h-4 w-4 mr-2" />
              <Trans>Behind the Build</Trans>
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              <Trans>The story behind it</Trans>
            </h2>
          </div>

          <div className="space-y-6">
            <Card className="border-l-4" style={{ borderLeftColor: app.accentColor }}>
              <CardContent className="p-6 flex gap-4">
                <div className="shrink-0 mt-1">
                  <Lightbulb className="h-6 w-6" style={{ color: app.accentColor }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    <Trans>The Problem</Trans>
                  </p>
                  <p className="text-base">{app.buildStory.problem}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: app.accentColor }}>
              <CardContent className="p-6 flex gap-4">
                <div className="shrink-0 mt-1">
                  <Rocket className="h-6 w-6" style={{ color: app.accentColor }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    <Trans>What I Built</Trans>
                  </p>
                  <p className="text-base">{app.buildStory.solution}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: app.accentColor }}>
              <CardContent className="p-6 flex gap-4">
                <div className="shrink-0 mt-1">
                  <CheckCircle className="h-6 w-6" style={{ color: app.accentColor }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    <Trans>What I Learned</Trans>
                  </p>
                  <p className="text-base">{app.buildStory.learned}</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Download CTA */}
      {app.url && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl text-center space-y-6">
            <div className="text-6xl mb-4">{app.icon}</div>
            <h2 className="text-3xl md:text-4xl font-bold">{app.tagline}</h2>
            <p className="text-xl text-muted-foreground">{app.description}</p>
            <Button size="lg" asChild style={{ backgroundColor: app.accentColor, color: "#fff" }}>
              <a href={app.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-5 w-5 mr-2" />
                <Trans>Get it on Google Play — Free</Trans>
              </a>
            </Button>
          </div>
        </section>
      )}

      {/* Other Apps */}
      {otherApps.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold">
                <Trans>More Apps</Trans>
              </h2>
              <Button variant="outline" asChild>
                <Link href={localePath(locale, "/apps")}>
                  <Trans>View All</Trans> <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherApps.map((other) => (
                <Link key={other.slug} href={localePath(locale, `/app/${other.slug}`)}>
                  <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer">
                    <CardContent className="p-6 flex gap-4 items-center">
                      <div
                        className="text-4xl p-3 rounded-2xl shrink-0"
                        style={{ backgroundColor: `${other.accentColor}15` }}
                      >
                        {other.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                          {other.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {other.tagline}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
