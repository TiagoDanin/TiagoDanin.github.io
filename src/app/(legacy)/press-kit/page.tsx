import fs from 'fs';
import path from 'path';
import Image from "next/image";
import Link from "next/link";
import { queryCollection } from 'nextjs-studio/server';
import { DEFAULT_LOCALE } from '@/lib/i18n/locales';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BioBrowser } from "@/components/sections/BioBrowser";
import { buildBios } from "@/lib/bios";
import { eventLabel } from "@/lib/talks";
import { getPressItems } from "@/lib/press";
import { withMarkdown } from '@/lib/markdown-alternate';
import {
  ArrowRight,
  Bot,
  Download,
  ExternalLink,
  FlaskConical,
  Linkedin,
  Mail,
  Mic,
  Smartphone,
} from "lucide-react";

export const metadata = {
  title: "Press Kit - Bios, Photos & Speaker Info",
  description: "Official press kit for Tiago Danin: ready to use bios in English and Portuguese, profile photo, logo, talk topics, and booking contact for events and media.",
  keywords: ["press kit", "media kit", "speaker bio", "Tiago Danin bio", "conference speaker", "mobile developer speaker", "palestrante mobile", "bio para eventos"],
  alternates: withMarkdown('https://tiagodanin.com/press-kit/'),
  openGraph: {
    title: "Press Kit - Tiago Danin",
    description: "Bios in English and Portuguese, photo, logo, talk topics and booking contact. Everything an event or publication needs.",
    url: "https://tiagodanin.com/press-kit/",
    type: "profile",
    profile: {
      firstName: "Tiago",
      lastName: "Danin",
      username: "tiagodanin",
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: "Press Kit - Tiago Danin",
    description: "Ready to use bios, photo, logo and talk topics for events and media.",
    creator: '@tiagodanin',
    site: '@tiagodanin',
  },
};

const PROJECT_COLLECTIONS = [
  'github', 'npm', 'googleplay', 'luarocks',
  'pypi', 'atom', 'windows', 'aur', 'private', 'offline',
] as const;

const roundDown = (value: number, step: number) => Math.floor(value / step) * step;

const PRESS_PHOTO_DIR = path.join(process.cwd(), 'public', 'images', 'press');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

interface PressPhoto {
  file: string;
  src: string;
  label: string;
}

/** Fallback caption for a file that has no entry in the presskit collection. */
function labelFromFilename(file: string): string {
  const base = path.basename(file, path.extname(file));
  const words = base.replace(/^\d+[-_]?/, '').replace(/[-_]+/g, ' ').trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : base;
}

/**
 * Lists the press photo folder at build time. Captions and order come from the
 * presskit collection; a file dropped into public/images/press without an entry
 * still shows up, at the end, with a caption derived from its filename.
 */
function readPressPhotos(captions: { file: string; caption: string }[]): PressPhoto[] {
  let files: string[] = [];
  try {
    files = fs.readdirSync(PRESS_PHOTO_DIR);
  } catch {
    return [];
  }

  const available = new Set(
    files.filter(file => IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()))
  );

  const curated = captions
    .filter(entry => available.has(entry.file))
    .map(entry => ({
      file: entry.file,
      src: `/images/press/${entry.file}`,
      label: entry.caption,
    }));

  const listed = new Set(curated.map(photo => photo.file));
  const extras = [...available]
    .filter(file => !listed.has(file))
    .sort((a, b) => a.localeCompare(b))
    .map(file => ({
      file,
      src: `/images/press/${file}`,
      label: labelFromFilename(file),
    }));

  return [...curated, ...extras];
}

const TOPICS = [
  {
    icon: Smartphone,
    title: "Mobile development in practice",
    description: "React Native, Flutter and native modules in Kotlin, Swift and Objective-C. What breaks in production and how to keep a codebase shippable.",
  },
  {
    icon: FlaskConical,
    title: "Testing and release automation",
    description: "Automated tests for mobile, fastlane match and certificates, feature flags, A/B testing with Firebase, and continuous delivery to both stores.",
  },
  {
    icon: Bot,
    title: "AI agents and MCP",
    description: "Model Context Protocol from scratch and how to take a product built with coding agents from idea to shipped code, without the hype.",
  },
  {
    icon: Mic,
    title: "Career, open source and community",
    description: "Getting started in mobile, maintaining open source packages, and preparing a profile that recruiters actually read.",
  },
];

const PressKitPage = () => {
  const about = queryCollection('about').one();
  const talks = [...queryCollection('talks').where({ lang: 'en' })];
  const work = [...queryCollection('work').locale(DEFAULT_LOCALE)];
  const npmPackages = [...queryCollection('npm')];
  const bioEntries = [...queryCollection('bios')];
  const pressItems = getPressItems();

  const projectsTotal = PROJECT_COLLECTIONS.reduce(
    (sum, key) => sum + [...queryCollection(key)].length,
    0
  );

  const sortedTalks = [...talks].sort((a, b) => b.date.localeCompare(a.date));
  const firstTalkYear = sortedTalks.length
    ? sortedTalks[sortedTalks.length - 1].date.slice(0, 4)
    : '';

  // Events, not editions: five DevOpsDays Belém years are one event.
  const events = Array.from(new Set(sortedTalks.map(talk => talk.event)));

  const workYears = work
    .map(item => Number(item.startDate))
    .filter(year => Number.isFinite(year));
  const firstWorkYear = workYears.length ? Math.min(...workYears) : 2018;
  const experienceYears = new Date().getFullYear() - firstWorkYear;

  const npmApprox = roundDown(npmPackages.length, 10);
  const projectsApprox = roundDown(projectsTotal, 50);

  const bios = buildBios(bioEntries, {
    years: experienceYears,
    firstTalkYear,
  });

  const photoCaptions = [...queryCollection('presskit')].map(entry => ({
    file: String(entry.file),
    caption: String(entry.caption),
  }));
  const pressPhotos = readPressPhotos(photoCaptions);
  const profilePhoto = pressPhotos.find(photo => photo.file.toLowerCase().startsWith('profile'));
  const galleryPhotos = pressPhotos.filter(photo => photo !== profilePhoto);

  const quickFacts = [
    { term: "Full name", detail: about.name, note: "Tiago without an h, Danin without an accent" },
    { term: "Current role", detail: "Mobile Developer" },
    { term: "Also", detail: "Independent Security Researcher" },
    { term: "Based in", detail: "Belém, Pará, Brazil" },
    { term: "Community", detail: "Organizer at Devs Norte, GDG Belém and DevOpsDays Belém", note: "Organizing events in Belém since 2019" },
    { term: "Education", detail: "Systems Analysis and Development, IFPA" },
    { term: "Recognition", detail: "1st place, TecBan Hackathon 2020", note: "Bicos, an open banking app for informal workers" },
    { term: "Speaks", detail: "Portuguese (native) and English" },
    { term: "Website", detail: "tiagodanin.com" },
    { term: "Handle", detail: "@tiagodanin", note: "GitHub, LinkedIn and Instagram" },
    { term: "Email", detail: about.email },
  ];

  const numbers = [
    { value: String(talks.length), label: firstTalkYear ? `talks since ${firstTalkYear}` : "talks" },
    { value: `${npmApprox}+`, label: "npm packages" },
    { value: `${projectsApprox}+`, label: "public projects" },
    { value: `${experienceYears}+`, label: "years in mobile" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "name": "Press Kit - Tiago Danin",
        "url": "https://tiagodanin.com/press-kit/",
        "inLanguage": ["en", "pt-BR"],
        "mainEntity": {
          "@type": "Person",
          "name": about.name,
          "url": "https://tiagodanin.com/",
          "image": about.avatar,
          "email": `mailto:${about.email}`,
          "description": bios.en.general.medium,
          "jobTitle": "Mobile Developer & Security Researcher",
          "knowsLanguage": ["pt-BR", "en"],
          "homeLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Belém",
              "addressRegion": "PA",
              "addressCountry": "BR"
            }
          },
          "sameAs": [
            "https://github.com/TiagoDanin",
            "https://linkedin.com/in/tiagodanin",
            "https://instagram.com/tiagodanin",
            "https://hackerone.com/tiago-danin"
          ]
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://tiagodanin.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Press Kit",
            "item": "https://tiagodanin.com/press-kit/"
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Intro */}
      <section className="relative pt-32 pb-16 overflow-x-clip">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-24 right-0 w-[420px] h-[420px] bg-purple-100 rounded-full blur-3xl opacity-25 translate-x-1/3"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-20 w-[380px] h-[380px] bg-green-100 rounded-full blur-3xl opacity-30"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:gap-16 items-start">
            <div className="space-y-6 max-w-2xl">
              <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
                Press kit
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]">
                Everything you need to introduce me
              </h1>
              <p className="text-lg text-foreground/85 leading-relaxed">
                Bios in English and Portuguese, photo, logo and talk topics, ready to copy.
                No approval needed: use what is on this page as it is, or trim it to fit.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="min-h-[44px]">
                  <a
                    href="https://linkedin.com/in/tiagodanin"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="mr-2 h-4 w-4" aria-hidden="true" />
                    Invite me to speak
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild className="min-h-[44px]">
                  <Link href="/talks">
                    See all {talks.length} talks <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 pt-7 border-t border-border/60">
                {numbers.map(item => (
                  <div key={item.label} className="space-y-1">
                    <dt className="text-xl sm:text-2xl font-bold tabular-nums tracking-tight">
                      {item.value}
                    </dt>
                    <dd className="text-xs text-muted-foreground leading-tight">
                      {item.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="justify-self-center lg:justify-self-end w-[220px] sm:w-[260px]">
              <div className="aspect-square rounded-full overflow-hidden bg-primary/10 ring-1 ring-slate-200/80 shadow-lg">
                <Image
                  src={about.avatar}
                  alt={`${about.name} profile photo`}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Quick facts</h2>
          <p className="mt-3 text-muted-foreground max-w-prose">
            The details that usually end up wrong in event programs.
          </p>

          <dl className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {quickFacts.map(fact => (
              <div key={fact.term} className="border-t border-border/60 pt-4">
                <dt className="text-sm font-medium text-muted-foreground">{fact.term}</dt>
                <dd className="mt-1 font-semibold break-words">{fact.detail}</dd>
                {fact.note && (
                  <dd className="mt-1 text-sm text-muted-foreground">{fact.note}</dd>
                )}
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Bios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Bios</h2>
          <p className="mt-3 text-muted-foreground max-w-prose">
            Pick a language and the angle that fits your event, then copy. Numbers come
            from the site data, so they stay current.
          </p>

          <div className="mt-8">
            <BioBrowser bios={bios} />
          </div>
        </div>
      </section>

      {/* Photo and logo */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Photo and logo</h2>
          <p className="mt-3 text-muted-foreground max-w-prose">
            Free to use in event pages, articles and slides announcing a talk.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:max-w-3xl">
            <div className="rounded-xl border bg-background p-6 shadow-sm">
              <div className="mx-auto w-40 aspect-square rounded-full overflow-hidden bg-primary/10 ring-1 ring-slate-200/80">
                <Image
                  src={profilePhoto?.src ?? about.avatar}
                  alt={`${about.name} profile photo`}
                  width={320}
                  height={320}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 font-semibold">Profile photo</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Square crop, works as a circle.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profilePhoto && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profilePhoto.src} download>
                      Download
                      <Download className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href={about.avatar} target="_blank" rel="noopener noreferrer">
                    Open full size
                    <ExternalLink className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-background p-6 shadow-sm">
              <div className="mx-auto w-40 aspect-square rounded-xl bg-muted flex items-center justify-center">
                <Image
                  src="/images/logo.svg"
                  alt="Tiago Danin logo"
                  width={96}
                  height={96}
                  className="h-24 w-24"
                />
              </div>
              <h3 className="mt-6 font-semibold">Logo</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                SVG, 1024 × 1024, black on transparent background.
              </p>
              <Button variant="outline" size="sm" asChild className="mt-4">
                <a href="/images/logo.svg" download>
                  Download SVG
                  <Download className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          {galleryPhotos.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold">Photos for promo art</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-prose">
                {galleryPhotos.length} photos to use in announcement posts, banners and
                event pages. Cropping and color grading to match your art direction is fine.
              </p>

              <div className="mt-6 grid gap-5 grid-cols-2 lg:grid-cols-4">
                {galleryPhotos.map(photo => (
                  <figure key={photo.file} className="rounded-xl border bg-background p-3 shadow-sm">
                    <div className="aspect-[4/5] overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={photo.src}
                        alt={`${about.name}, ${photo.label.toLowerCase()}`}
                        width={640}
                        height={800}
                        className="h-full w-full object-cover object-[50%_30%]"
                      />
                    </div>
                    <figcaption className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground truncate">
                        {photo.label}
                      </span>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 shrink-0">
                        <a href={photo.src} download aria-label={`Download ${photo.label}`}>
                          <Download className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </Button>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:max-w-3xl">
            <div>
              <h3 className="font-semibold">Please do</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Write the name as “Tiago Danin”, without an h and without accents.</li>
                <li>Use any bio above as it is, or cut it down to fit your layout.</li>
                <li>Link back to tiagodanin.com when you publish.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Please don’t</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Recolor the logo, add effects, or stretch it out of proportion.</li>
                <li>Crop the photo into shapes other than a square or a circle.</li>
                <li>Present a talk as an endorsement from any company he works with.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Talk topics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Talk topics</h2>
          <p className="mt-3 text-muted-foreground max-w-prose">
            What I usually present. Each one can run as a talk, a workshop, or a panel.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TOPICS.map(topic => {
              const Icon = topic.icon;
              return (
                <div
                  key={topic.title}
                  className="rounded-xl border bg-background p-6 shadow-sm"
                >
                  <Icon className="h-6 w-6 text-foreground" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold leading-snug">{topic.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Speaking history */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Speaking history</h2>
          <p className="mt-3 text-muted-foreground max-w-prose">
            {talks.length} talks{firstTalkYear ? ` since ${firstTalkYear}` : ''}, at {events.length} different events.
          </p>

          <ul className="mt-8 divide-y divide-border/60 border-y border-border/60 lg:max-w-3xl">
            {sortedTalks.slice(0, 5).map(talk => (
              <li key={talk.slug} className="py-4">
                <Link
                  href={`/talk/${talk.slug}`}
                  className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {talk.title}
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {eventLabel(talk)}, {talk.date}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h3 className="text-sm font-medium text-muted-foreground">Events</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {events.map(event => (
                <Badge key={event} variant="outline" className="font-normal">
                  {event}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button variant="outline" asChild className="min-h-[44px]">
              <Link href="/talks">
                See all {talks.length} talks <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* In the press */}
      {pressItems.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">In the press</h2>
            <p className="mt-3 text-muted-foreground max-w-prose">
              {pressItems.length} articles and releases published by others, all in Portuguese.
            </p>

            <ul className="mt-8 divide-y divide-border/60 border-y border-border/60 lg:max-w-3xl">
              {pressItems.slice(0, 3).map(item => (
                <li key={item.url} className="py-4">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {item.outlet}, {item.date.slice(0, 4)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button variant="outline" asChild className="min-h-[44px]">
                <Link href="/press">
                  See all {pressItems.length} mentions <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-prose">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Booking and press</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              LinkedIn is where I answer fastest. Email works as a second option.
              Either way, in Portuguese or English.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild className="min-h-[44px]">
                <a href="https://linkedin.com/in/tiagodanin" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="mr-2 h-4 w-4" aria-hidden="true" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" asChild className="min-h-[44px]">
                <a href={`mailto:${about.email}?subject=Talk%20invitation`}>
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                  {about.email}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PressKitPage;
