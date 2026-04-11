import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { Badge } from "@/components/ui/badge";
import { Globe, Mic, Video } from "lucide-react";
import { getRandomColor, toISODate } from '@/utils/parse';

export const metadata = {
  title: "Palestras & Apresentações PT-BR | Tech Talks",
  description: "Palestras sobre desenvolvimento mobile, Flutter, React Native e segurança. Apresentações em eventos tech, workshops e comunidades de desenvolvedores brasileiros.",
  keywords: ["palestras", "talks", "apresentações", "workshops", "mobile development", "Flutter", "React Native", "cybersecurity", "pt-br", "eventos tech", "DevFest", "DevOpsDays"],
  alternates: {
    canonical: 'https://tiagodanin.com/talks/pt',
    types: {
      'application/rss+xml': [
        { url: '/rss/talks.xml', title: 'Talks RSS Feed' }
      ],
    },
  },
  openGraph: {
    title: "Palestras & Apresentações Tech PT-BR",
    description: "Palestras sobre mobile development, Flutter, React Native e cybersecurity. Apresentações em eventos tech brasileiros.",
    url: "https://tiagodanin.com/talks/pt",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Palestras Tech PT-BR | Tiago Danin",
    description: "Palestras sobre mobile, Flutter, React Native e segurança em eventos tech brasileiros.",
    creator: "@tiagodanin",
  },
};

const TalksPtPage = () => {
  const talks = queryCollection('talks').where({ lang: 'pt' });
  const sortedTalks = [...talks].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const breadcrumbSchema = {
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
        "name": "Palestras",
        "item": "https://tiagodanin.com/talks/pt"
      }
    ]
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": sortedTalks.map((talk) => ({
      "@type": "Event",
      "name": talk.title,
      "description": talk.description,
      "startDate": toISODate(talk.date),
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": talk.youtubeUrl ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": talk.event
      },
      "organizer": {
        "@type": "Organization",
        "name": talk.event
      },
      "performer": {
        "@type": "Person",
        "name": "Tiago Danin"
      },
      "url": `https://tiagodanin.com/talk/${talk.slug}/pt`,
      "inLanguage": "pt-BR"
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Palestras</h1>
          </div>
          <p className="mt-4 text-muted-foreground">
            Palestras, apresentações e workshops sobre tecnologia e desenvolvimento
          </p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <p className="text-sm text-muted-foreground">
              Total de palestras: {talks.length}
            </p>
            <Link href="/talks" className="text-sm text-primary hover:underline flex items-center gap-1">
              <Globe className="h-3 w-3" />
              EN
            </Link>
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              PT
            </Badge>
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-16">
          {sortedTalks.map((talk) => {
            return (
              <article key={talk.slug} className="group relative flex flex-col items-start hover:shadow-lg">
                <Link href={`/talk/${talk.slug}/pt`} className="absolute inset-0 z-10">
                  <span className="sr-only">Ver {talk.title}</span>
                </Link>
                <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800" />

                <div className="relative z-10 order-first mb-3 flex items-center gap-2">
                  <time className="flex items-center text-sm text-zinc-400 pl-3.5">
                    <span className="absolute inset-y-0 left-0 flex items-center">
                      <span className="h-4 w-0.5 rounded-full bg-zinc-200" />
                    </span>
                    {talk.date}
                  </time>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Mic className="h-3 w-3" />
                    {talk.event}
                  </Badge>
                </div>

                <h2 className="relative z-10 text-base font-semibold tracking-tight">
                  <Link href={`/talk/${talk.slug}/pt`} className="relative z-10">
                    <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                    {talk.title}
                  </Link>
                </h2>

                <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Link href={`/talk/${talk.slug}/pt`} className="relative z-10">
                    {talk.description}
                  </Link>
                </p>

                <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                  {talk.tags && talk.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${getRandomColor()}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary">
                  {talk.youtubeUrl ? (
                    <div className="flex gap-4">
                      <Link
                        href={`/talk/${talk.slug}/pt`}
                        className="flex items-center hover:underline"
                      >
                        Ver detalhes
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                          <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                      <Link
                        href={talk.youtubeUrl}
                        className="flex items-center text-red-600 dark:text-red-400 hover:underline z-20"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Video className="h-4 w-4 mr-1" />
                        Assistir no YouTube
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Ver detalhes
                      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="ml-1 h-4 w-4 stroke-current">
                        <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TalksPtPage;
