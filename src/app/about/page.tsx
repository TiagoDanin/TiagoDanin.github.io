import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { CallToAction } from "@/components/sections/CallToAction";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { Badge } from "@/components/ui/badge";
import { queryCollection } from 'nextjs-studio/server';
import { withMarkdown } from '@/lib/markdown-alternate';
import { getPressItems, pressDate } from "@/lib/press";

interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  tags: string[];
}

export const metadata = {
  title: "About - Flutter, React Native & Bug Hunter",
  description: "Mobile developer with 8+ years of experience in Flutter, React Native & native iOS/Android. Bug hunter on HackerOne, 70+ npm packages, 18+ conference talks. Based in Brazil.",
  keywords: ["Mobile Developer", "Flutter Developer", "React Native Developer", "iOS Developer", "Android Developer", "Bug Hunter", "Open Source Contributor", "Security Researcher", "Technical Mentor"],
  alternates: withMarkdown('https://tiagodanin.com/about/'),
  openGraph: {
    title: "Tiago Danin - Mobile Developer & Bug Hunter",
    description: "Mobile developer specializing in Flutter, React Native & native iOS/Android. Open source contributor, security researcher, and mentor. Let's build together.",
    url: "https://tiagodanin.com/about/",
    type: "profile",
    profile: {
      firstName: "Tiago",
      lastName: "Danin",
      username: "tiagodanin",
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Tiago Danin - Mobile Developer",
    description: "Flutter expert, React Native developer, security researcher & bug hunter. Open source advocate. Crafting innovative mobile solutions.",
    creator: '@tiagodanin',
    site: '@tiagodanin',
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "mainEntity": {
        "@type": "Person",
        "name": "Tiago Danin",
        "url": "https://tiagodanin.com/",
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
          "item": "https://tiagodanin.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "About",
          "item": "https://tiagodanin.com/about/"
        }
      ]
    }
  ]
};

const Index = () => {
  const workData = queryCollection('work');
  const volunteerData = queryCollection('volunteer');
  const skillsData = queryCollection('skills');
  const aboutData = queryCollection('about').one();

  // Milestones and press are what this page has that the home does not: the
  // home sells what he builds, /about backs it with a record.
  const milestones = ([...queryCollection('timeline')] as unknown as TimelineEntry[])
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);
  const pressItems = getPressItems().slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <Hero showPressKit />
      <Work work={[...workData]} volunteer={[...volunteerData]} skills={[...skillsData]} about={aboutData} />

      <section className="py-20 relative overflow-hidden" aria-labelledby="milestones-heading">
        {/* Orbs de marca: verde-100 no canto esquerdo, lilás-100 no direito */}
        <div className="absolute -left-32 top-1/4 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-30" aria-hidden="true" />
        <div className="absolute -right-32 bottom-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-25" aria-hidden="true" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 id="milestones-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
            Milestones
          </h2>

          <ol className="mt-8 space-y-6">
              {milestones.map((event) => (
                <li
                  key={`${event.date}-${event.title}`}
                  className="rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <time dateTime={event.date} className="text-sm font-semibold text-muted-foreground">
                      {event.date}
                    </time>
                    {(event.tags ?? []).slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="mt-3 text-lg font-semibold leading-snug">{event.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </li>
              ))}
            </ol>

          <Link
            href="/timeline"
            className="mt-8 inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4 min-h-[44px]"
          >
            Full timeline
            <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {pressItems.length > 0 && (
        <section className="py-20 bg-muted/30" aria-labelledby="press-heading">
          <div className="container mx-auto px-4">
            <h2 id="press-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
              In the press
            </h2>

            <ul className="mt-8 grid gap-6">
                {pressItems.map((item) => (
                  <li key={item.url}>
                    <article className="rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="font-semibold">{item.outlet}</span>
                        <span aria-hidden="true" className="text-muted-foreground">·</span>
                        <time dateTime={item.date} className="text-sm text-muted-foreground">
                          {pressDate(item.date)}
                        </time>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold leading-snug">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline hover:text-primary transition-colors"
                        >
                          {item.title}
                          <ExternalLink
                            className="ml-1.5 inline h-4 w-4 align-baseline text-muted-foreground group-hover:text-primary transition-colors"
                            aria-hidden="true"
                          />
                        </a>
                      </h3>
                    </article>
                  </li>
                ))}
              </ul>

            <Link
              href="/press"
              className="mt-8 inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-4 min-h-[44px]"
            >
              All press mentions
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      <CallToAction />
    </>
  );
};

export default Index;