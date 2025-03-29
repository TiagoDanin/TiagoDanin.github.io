'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import projectsData from "@/data/projects.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Projects() {
  const pathname = usePathname();
  const isFullProjects = pathname === "/projects";

  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  return (
    <section id="projects" className="relative py-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto relative">
        <div className="space-y-16">
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
            <p className="mt-4 text-muted-foreground">
              Explore my portfolio of innovative projects, from mobile apps to web solutions. Each project represents a unique challenge tackled with creativity and technical expertise, showcasing my journey in software development.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl relative">
            <div className={`${(isExpanded || !isMobile) ? '' : 'h-[780px] overflow-hidden'} relative`}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projectsData.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>

              <div className="text-center">
                {!isFullProjects && (
                  <>
                    <Button size="lg" asChild className="mt-4">
                      <Link href="/projects">
                        More projects
                      </Link>
                    </Button>
                    <p className="text-muted-foreground mt-2 text-sm">
                      <p className="font-bold">+300 projects</p> So far and more to come
                    </p>
                  </>
                )}
              </div>

              {!(isExpanded || !isMobile) && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card/90 to-transparent pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        {!isExpanded && isMobile && (<div className="flex flex-col gap-3 px-6">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="w-full"
          >
            <span className="flex items-center gap-2">
              Show More <ChevronDown className="h-4 w-4" />
            </span>
          </Button>
        </div>)}
      </div>
    </section>
  );
}