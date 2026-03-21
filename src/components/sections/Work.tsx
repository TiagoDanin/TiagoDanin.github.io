'use client'

import { useState } from "react";
import {
  Briefcase,
  Code as CodeIcon,
  ChevronDown,
  Users,
  Brain,
  MessageCircle,
  Target,
  Calendar
} from "lucide-react";
import {
  SiFlutter, SiReact, SiKotlin, SiSwift, SiIonic,
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiVuedotjs, SiTailwindcss,
  SiNodedotjs, SiPostgresql, SiSqlite,
  SiFigma, SiCanva, SiUnity, SiBlender, SiAdobexd,
  SiFirebase, SiGitlab, SiGithub, SiGooglecloud, SiDocker
} from "react-icons/si";
import { FaCode, FaServer, FaJava, FaMicrosoft, FaGamepad, FaPalette } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ExperienceItem } from "@/components/ui/experience-item";

interface WorkEntry {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  logo: string;
  description: string;
}

interface VolunteerEntry {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  logo: string;
  description: string;
  category: string;
}

interface SkillItem {
  name: string;
  icon: string;
  color: string;
}

interface SkillsEntry {
  category: string;
  items: SkillItem[];
}

interface AboutEntry {
  name: string;
  greeting: string;
  roles: string[];
  avatar: string;
  bio: string;
  bioExtra: string;
  seoDescription: string;
  cvUrl: string;
  email: string;
}

interface WorkProps {
  work: WorkEntry[];
  volunteer: VolunteerEntry[];
  skills: SkillsEntry[];
  about: AboutEntry;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  SiFlutter, SiReact, SiKotlin, SiSwift, SiIonic,
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiVuedotjs, SiTailwindcss,
  SiNodedotjs, SiPostgresql, SiSqlite,
  SiFigma, SiCanva, SiUnity, SiBlender, SiAdobexd,
  SiFirebase, SiGitlab, SiGithub, SiGooglecloud, SiDocker,
  FaCode, FaServer, FaJava, FaMicrosoft, FaGamepad, FaPalette,
  Users, Brain, MessageCircle, Target, Calendar,
};

const TechIcon = ({ icon: iconName, name, color }: { icon: string, name: string, color: string }) => {
  const Icon = iconMap[iconName];
  if (!Icon) return null;
  return (
    <div className="tech-badge" style={{ backgroundColor: color }}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">{name}</span>
    </div>
  );
};

export function Work({ work, volunteer, skills, about }: WorkProps) {
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
            <div className={`${isExpanded ? '' : 'h-[660px] overflow-hidden'} relative`}>
              <h3 className="flex text-sm font-semibold items-center">
                <Briefcase className="h-5 w-5 flex-none" />
                <span className="ml-3">Professional Experience</span>
              </h3>

              {/* Experience */}
              <ol className="mt-6 space-y-6">
                <h3 className="flex text-sm font-semibold items-center">
                  <span>Experience</span>
                </h3>

                {work.map((job, index) => (
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

                {volunteer.map((job, index) => (
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
                <a href={about.cvUrl} className="inline-flex items-center gap-2">
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
              {skills.map((category) => (
                <div key={category.category} className="space-y-2">
                  <h4 className="text-sm font-medium">{category.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <TechIcon
                        key={item.name}
                        icon={item.icon}
                        name={item.name}
                        color={item.color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
