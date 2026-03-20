import { Github, Linkedin, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { LucideIcon } from "lucide-react";

interface SocialLink {
  label: string;
  url: string;
  icon: "Github" | "Linkedin" | "Youtube" | "Instagram";
}

interface SocialLinksProps {
  socialLinks: SocialLink[];
}

const iconMap: Record<string, LucideIcon> = {
  Github,
  Linkedin,
  Youtube,
  Instagram,
};

export function SocialLinks({ socialLinks }: SocialLinksProps) {
  const socialLinksData = socialLinks;
  return (
    <div className="flex gap-4">
      {socialLinksData.map((link) => {
        const Icon = iconMap[link.icon];
        if (!Icon) return null;
        return (
          <Button key={link.label} variant="ghost" size="icon" className="h-12 w-12" asChild>
            <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
              <Icon className="h-6 w-6" />
            </a>
          </Button>
        );
      })}
    </div>
  );
}
