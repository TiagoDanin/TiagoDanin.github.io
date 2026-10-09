'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { DEFAULT_LOCALE, localePath, splitLocale, type Locale } from '@/lib/i18n/locales';
import { Trans } from "@lingui/react/macro";

interface ProjectsEntry {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
}

interface ProjectsProps {
  /**
   * Language the internal links are built for. Defaults to English.
   *
   * Without it the card links here pointed at the English pages from `/br/`:
   * a hardcoded `href` never passes through `localePath`, so a page-level check
   * misses it entirely.
   */
  locale?: Locale;

  projects: ProjectsEntry[];

  /**
   * How many cards to show, drawn at random from `projects` on every visit.
   * Leave it out to show the whole list, in order.
   *
   * The export is static, so the draw happens in the browser: the HTML carries
   * the first `limit` entries, and the shuffle replaces them after hydration.
   * Shuffling during render would make the server and client markup disagree.
   */
  limit?: number;
}

function pickRandom<T>(items: T[], count: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function Projects({ projects, locale = DEFAULT_LOCALE, limit }: ProjectsProps) {
  const [projectsData, setProjectsData] = useState(() =>
    limit === undefined ? projects : projects.slice(0, limit),
  );

  useEffect(() => {
    setProjectsData(limit === undefined ? projects : pickRandom(projects, limit));
  }, [projects, limit]);

  const pathname = usePathname();
  // `/br/projects` and the build-time `/en/projects` are the same page.
  const isFullProjects = splitLocale(pathname ?? "/").base === "/projects";

  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section id="projects" className="relative py-20 overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 w-[480px] h-[480px] bg-purple-100 rounded-full blur-3xl opacity-25 -translate-x-1/2 translate-y-1/3" />

      <div className="container mx-auto relative px-4">
        <div className="space-y-16">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"><Trans>Selected work</Trans></h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              <Trans>A handful of projects across mobile, web, and games. The full archive lives below.</Trans>
            </p>
          </div>

          <div className={`${(isExpanded || !isMobile) ? '' : 'h-[780px] overflow-hidden'} relative`}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projectsData.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>

            {!isFullProjects && (
              <div className="mt-12 flex justify-center">
                <Button size="lg" variant="outline" asChild>
                  <Link href={localePath(locale, "/projects")}>
                    <Trans>See all 250+ projects</Trans>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {!(isExpanded || !isMobile) && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-background to-transparent pointer-events-none" />
            )}

            {isMobile && (
              <div className="flex flex-col gap-3 mt-4">
                <Button
                  onClick={() => setIsExpanded(!isExpanded)}
                  variant="outline"
                  className="w-full"
                >
                  <span className="flex items-center gap-2">
                    {isExpanded ? 'Show Less' : 'Show More'} {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}