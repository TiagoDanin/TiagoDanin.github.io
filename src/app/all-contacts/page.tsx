import contacts from '@/data/contacts.json';
import {
  ExternalLink,
  Home,
  Image as Gallery,
  Camera,
  Github,
  User,
  Twitter,
  Gamepad2,
  MessageCircle,
  Rocket,
  Globe,
  Package,
  Linkedin,
  Mail,
  Timer,
  LayoutTemplate,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const metadata = {
  title: "All Contacts",
  description: "Contact Me & Social Media.",
};

const iconMap: Record<string, LucideIcon> = {
  'ti-home': Home,
  'ti-gallery': Gallery,
  'ti-camera': Camera,
  'ti-github': Github,
  'ti-user': User,
  'ti-reddit': Globe,
  'ti-twitter-alt': Twitter,
  'ti-game': Gamepad2,
  'ti-microsoft-alt': Globe,
  'ti-linux': Globe,
  'ti-comment': MessageCircle,
  'ti-rocket': Rocket,
  'ti-world': Globe,
  'ti-package': Package,
  'ti-stack-overflow': Globe,
  'ti-linkedin': Linkedin,
  'ti-email': Mail,
  'ti-timer': Timer,
  'ti-layout-tab': LayoutTemplate,
};

export default function AllContactsPage() {
  return (
    <div className="relative py-32 px-4 container mx-auto overflow-hidden">
      {/* Blur background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold mb-8 text-center">All Contacts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {contacts.map((contact) => {
            const LucideIcon = iconMap[contact.icon] || Globe;
            return (
              <a
                key={contact.url}
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center gap-2"
              >
                <LucideIcon className="text-4xl mb-1" />
                <span className="font-medium text-lg">{contact.label}</span>
                <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
} 