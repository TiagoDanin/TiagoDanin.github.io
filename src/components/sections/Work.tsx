'use client'

import { useState } from "react";
import { Briefcase, Code as CodeIcon, ChevronDown, ChevronUp } from "lucide-react";
import { 
  SiFlutter, SiReact, SiKotlin, SiSwift, SiIonic,
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiVuedotjs, SiTailwindcss,
  SiNodedotjs, SiPostgresql, SiSqlite,
  SiFigma, SiCanva, SiUnity, SiBlender,
  SiFirebase, SiGitlab, SiGithub, SiGooglecloud, SiDocker
} from "react-icons/si";
import { FaCode, FaServer, FaJava, FaMicrosoft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import workData from "@/data/work.json";
import volunteerData from "@/data/volunteer.json";
import { ExperienceItem } from "@/components/ui/experience-item";

const TechIcon = ({ icon: Icon, name, color }: { icon: any, name: string, color: string }) => (
  <div className="tech-badge" style={{ backgroundColor: color }}>
    <Icon className="w-4 h-4" />
    <span className="text-xs font-medium">{name}</span>
  </div>
);

export function Work() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="work" className="relative py-20 overflow-hidden">
      {/* Blur effect circles */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto relative px-4">
        {/* Title and description */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Experience & Skills</h2>
          <p className="mt-4 text-muted-foreground">
            My professional journey and the technical skills I've developed over the years.
          </p>
        </div>

        {/* Two cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Experience Card */}
          <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl relative">
            <div className={`${isExpanded ? '' : 'h-[600px] overflow-hidden'} relative`}>
              <h3 className="flex text-sm font-semibold items-center">
                <Briefcase className="h-5 w-5 flex-none" />
                <span className="ml-3">Professional Experience</span>
              </h3>

              {/* Experience */}
              <ol className="mt-6 space-y-6">
                <h3 className="flex text-sm font-semibold items-center">
                  <span>Experience</span>
                </h3>

                {workData.map((job, index) => (
                  <ExperienceItem
                    key={index}
                    company={job.company}
                    role={job.role}
                    startDate={job.startDate}
                    endDate={job.endDate}
                    logo={job.logo}
                    description={job.description}
                  />
                ))}
              </ol>

              {/* Volunteering */}
              <ol className="mt-8 space-y-6">
                <h3 className="flex text-sm font-semibold items-center">
                  <span>Volunteering</span>
                </h3>

                {volunteerData.map((job, index) => (
                  <ExperienceItem
                    key={index}
                    company={job.organization}
                    role={job.role}
                    startDate={job.startDate}
                    endDate={job.endDate}
                    logo={job.logo}
                    description={job.description}
                  />
                ))}
              </ol>

              <Button className="w-full group" variant="outline" asChild>
                <a href="https://linkedin.com/in/tiagodanin" className="inline-flex items-center gap-2">
                  Open CV
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-4 w-4 stroke-muted-foreground transition group-hover:stroke-primary">
                    <path d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Button>

              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card/90 to-transparent pointer-events-none" />
              )}
            </div>

            {!isExpanded && (<div className="flex flex-col gap-3 mt-6">
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

          {/* Skills Card */}
          <div className="bg-card/50 backdrop-blur-xl p-6 rounded-2xl">
            <h3 className="flex text-sm font-semibold items-center">
              <CodeIcon className="h-5 w-5 flex-none" />
              <span className="ml-3">Technical Skills</span>
            </h3>

            <div className="mt-6 space-y-4">
              {/* Mobile */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Mobile Development</h4>
                <div className="flex flex-wrap gap-2">
                  <TechIcon icon={SiFlutter} name="Flutter" color="#02569B" />
                  <TechIcon icon={SiReact} name="React Native" color="#0096b9" />
                  <TechIcon icon={FaJava} name="Java" color="#d55a02" />
                  <TechIcon icon={SiKotlin} name="Kotlin" color="#7F52FF" />
                  <TechIcon icon={SiSwift} name="Swift" color="#F05138" />
                  <TechIcon icon={SiIonic} name="Ionic" color="#3880FF" />
                </div>
              </div>

              {/* DevOps */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">DevOps</h4>
                <div className="flex flex-wrap gap-2">
                  <TechIcon icon={SiFirebase} name="Firebase" color="#ff2300" />
                  <TechIcon icon={SiGitlab} name="GitLab CI/CD" color="#FC6D26" />
                  <TechIcon icon={SiGithub} name="GitHub CI/CD" color="#181717" />
                  <TechIcon icon={FaMicrosoft} name="Azure" color="#0078D4" />
                  <TechIcon icon={SiGooglecloud} name="Google Cloud" color="#4285F4" />
                  <TechIcon icon={SiDocker} name="Docker" color="#2496ED" />
                </div>
              </div>

              {/* Frontend */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Frontend</h4>
                <div className="flex flex-wrap gap-2">
                  <TechIcon icon={SiHtml5} name="HTML" color="#E34F26" />
                  <TechIcon icon={SiCss3} name="CSS" color="#264DE4" />
                  <TechIcon icon={SiJavascript} name="JavaScript" color="#B8860B" />
                  <TechIcon icon={SiTypescript} name="TypeScript" color="#3178C6" />
                  <TechIcon icon={SiReact} name="React" color="#20A7C7" />
                  <TechIcon icon={SiVuedotjs} name="Vue.js" color="#4FC08D" />
                  <TechIcon icon={SiTailwindcss} name="Tailwind" color="#0891B2" />
                </div>
              </div>

              {/* Backend */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Backend</h4>
                <div className="flex flex-wrap gap-2">
                  <TechIcon icon={SiNodedotjs} name="Node.js" color="#339933" />
                  <TechIcon icon={FaServer} name="Express" color="#000000" />
                  <TechIcon icon={FaCode} name="Elixir" color="#4B275F" />
                  <TechIcon icon={SiPostgresql} name="PostgreSQL" color="#336791" />
                  <TechIcon icon={SiSqlite} name="SQLite" color="#003B57" />
                </div>
              </div>

              {/* Design */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Design</h4>
                <div className="flex flex-wrap gap-2">
                  <TechIcon icon={SiFigma} name="Figma" color="#F24E1E" />
                  <TechIcon icon={FaCode} name="Adobe XD" color="#A855F7" />
                  <TechIcon icon={SiCanva} name="Canva" color="#00bce5" />
                </div>
              </div>

              {/* Game Development */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Game Development</h4>
                <div className="flex flex-wrap gap-2">
                  <TechIcon icon={SiUnity} name="Unity" color="#000000" />
                  <TechIcon icon={SiBlender} name="Blender" color="#F5792A" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}