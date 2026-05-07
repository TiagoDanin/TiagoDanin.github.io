'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface ProjectsEntry {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
}

interface ProjectsProps {
  projects: ProjectsEntry[];
}

export function Projects({ projects }: ProjectsProps) {
  const projectsData = projects;
  const pathname = usePathname();
  const isFullProjects = pathname === "/projects";

  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto relative px-4">
        <div className="space-y-16">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">Selected work</h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              A handful of projects across mobile, web, and games. The full archive lives below.
            </p>
          </div>

          <div className={`${(isExpanded || !isMobile) ? '' : 'h-[780px] overflow-hidden'} relative`}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projectsData.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>

            {!isFullProjects && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-3 text-center">
                <p className="text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">
                  250+ projects
                </p>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/projects">Browse the full archive</Link>
                </Button>
              </div>
            )}

            {!(isExpanded || !isMobile) && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
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