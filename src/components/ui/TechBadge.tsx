import {
  SiFlutter, SiReact, SiKotlin, SiSwift, SiIonic,
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiVuedotjs, SiTailwindcss,
  SiNodedotjs, SiPostgresql, SiSqlite,
  SiFigma, SiCanva, SiUnity, SiBlender, SiAdobexd,
  SiFirebase, SiGitlab, SiGithub, SiGooglecloud, SiDocker,
} from 'react-icons/si';
import { FaCode, FaServer, FaJava, FaMicrosoft, FaGamepad, FaPalette } from 'react-icons/fa';
import { Brain, Calendar, MessageCircle, Target, Users } from 'lucide-react';

export const TECH_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  SiFlutter, SiReact, SiKotlin, SiSwift, SiIonic,
  SiHtml5, SiCss3, SiJavascript, SiTypescript, SiVuedotjs, SiTailwindcss,
  SiNodedotjs, SiPostgresql, SiSqlite,
  SiFigma, SiCanva, SiUnity, SiBlender, SiAdobexd,
  SiFirebase, SiGitlab, SiGithub, SiGooglecloud, SiDocker,
  FaCode, FaServer, FaJava, FaMicrosoft, FaGamepad, FaPalette,
  Users, Brain, MessageCircle, Target, Calendar,
};

export interface TechBadgeProps {
  icon: string;
  name: string;
  color: string;
}

export function TechBadge({ icon, name, color }: TechBadgeProps) {
  const Icon = TECH_ICONS[icon];
  if (!Icon) return null;

  return (
    <div className="tech-badge" style={{ backgroundColor: color, color: '#fff' }}>
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">{name}</span>
    </div>
  );
}
