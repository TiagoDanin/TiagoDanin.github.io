import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ChevronDown, ChevronUp } from "lucide-react";
import projectsData from "@/data/projects.json";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";

export function Projects() {
  const pathname = usePathname();
  const isFullProjects = pathname === "/projects";

  const [showAll, setShowAll] = useState(false);
  const isMobile = useIsMobile();

  const visibleProjects = isMobile
    ? (showAll ? projectsData : projectsData.slice(0, 2))
    : projectsData;

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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>

          <div className="text-center">
            {isMobile && (
              <Button
                variant="ghost"
                onClick={() => setShowAll(!showAll)}
                className="mx-auto flex items-center gap-2"
              >
                {showAll ? (
                  <>Show Less <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>Show More <ChevronDown className="h-4 w-4" /></>
                )}
              </Button>
            )}

            {!isFullProjects && (
              <Button size="lg" asChild className="mt-4">
                <a
                  href="https://github.com/TiagoDanin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More projects on Github
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}