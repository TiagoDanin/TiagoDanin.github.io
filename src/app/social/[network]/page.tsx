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
import { notFound } from 'next/navigation';

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

export async function generateMetadata({ params }: { params: { network: string } }) {
  const contact = contacts.find(c => c.label.toLowerCase().replace(/\s+/g, '') === params.network.toLowerCase());
  if (!contact) {
    return {
      title: 'Contact Not Found',
      description: 'This social/contact network does not exist.'
    };
  }
  return {
    title: `${contact.label} | Social Contact` ,
    description: `Find me on ${contact.label}. Social and contact information for Tiago Danin.`,
    openGraph: {
      title: `${contact.label} | Social Contact` ,
      description: `Find me on ${contact.label}. Social and contact information for Tiago Danin.`,
      url: contact.url,
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${contact.label} | Social Contact` ,
      description: `Find me on ${contact.label}. Social and contact information for Tiago Danin.`,
    },
  };
}

export default function SocialContactPage({ params }: { params: { network: string } }) {
  const contact = contacts.find(c => c.label.toLowerCase().replace(/\s+/g, '') === params.network.toLowerCase());
  if (!contact) return notFound();
  const LucideIcon = iconMap[contact.icon] || Globe;
  return (
    <div className="relative py-20 px-4 container mx-auto min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 z-0"></div>
      <div className="flex flex-col items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-md p-10 rounded-2xl shadow-md relative z-10 max-w-md w-full text-center gap-4">
        <LucideIcon className="text-5xl mb-2 mx-auto" />
        <h1 className="text-2xl font-bold">{contact.label}</h1>
        <a
          href={contact.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium justify-center"
        >
          <ExternalLink className="h-5 w-5" />
          {contact.url}
        </a>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return contacts.map(contact => ({ network: contact.label.toLowerCase().replace(/\s+/g, '') }));
} 