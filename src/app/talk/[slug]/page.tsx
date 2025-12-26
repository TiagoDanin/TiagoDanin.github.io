import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Mic, Video, Tag } from 'lucide-react';

import talks from "@/data/talks.json";
import { titleToSlug, getRandomColorWithDarkMode, toISODate } from '@/utils/parse';
import { Button } from '@/components/ui/button';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  
  const talk = talks.find((item) => {
    const itemSlug = titleToSlug(item.title);
    return itemSlug === slug;
  });

  if (!talk) {
    return {
      title: 'Talk Not Found',
      description: 'The requested talk could not be found.',
    };
  }

  // Truncate description to 160 characters
  const truncatedDescription = talk.description.length > 160
    ? talk.description.substring(0, 157) + '...'
    : talk.description;

  return {
    title: `${talk.title} - ${talk.event}`,
    description: truncatedDescription,
    keywords: ['talk', 'presentation', 'workshop', 'speaking', 'mobile development', 'pt-br', talk.event],
    alternates: {
      canonical: `https://tiagodanin.com/talk/${slug}`,
    },
    openGraph: {
      title: `${talk.title} - ${talk.event}`,
      description: truncatedDescription,
      type: 'article',
      url: `https://tiagodanin.com/talk/${slug}`,
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${talk.title} | ${talk.event} | Tiago Danin`,
      description: truncatedDescription,
    },
  };
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];

  talks.forEach((talk) => {
    const slug = titleToSlug(talk.title);
    
    if (slug) {
      params.push({ slug });
    }
  });

  return params;
}

export default function TalkPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  const talk = talks.find((item) => {
    const itemSlug = titleToSlug(item.title);
    return itemSlug === slug;
  });

  if (!talk) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": talk.title,
    "description": talk.description,
    "startDate": toISODate(talk.date),
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": talk.youtubeUrl ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": talk.event
    },
    "organizer": {
      "@type": "Organization",
      "name": talk.event
    },
    "performer": {
      "@type": "Person",
      "name": "Tiago Danin"
    },
    "offers": talk.youtubeUrl ? {
      "@type": "Offer",
      "url": talk.youtubeUrl,
      "availability": "https://schema.org/InStock",
      "price": 0,
      "priceCurrency": "BRL"
    } : undefined,
    "url": `https://tiagodanin.com/talk/${slug}`,
    "inLanguage": "pt-BR"
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Talk header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Mic className="h-6 w-6" />
              <h1 className="text-3xl font-bold">{talk.title}</h1>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 px-3 py-1 rounded-full text-sm flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {talk.date}
              </span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-3 py-1 rounded-full text-sm flex items-center">
                <Mic className="h-3 w-3 mr-1" />
                {talk.event}
              </span>
            </div>

            {talk.tags && talk.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Tag className="h-4 w-4" />
                {talk.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={`px-3 py-1 rounded-full text-sm ${getRandomColorWithDarkMode(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-6 whitespace-pre-line">
              {talk.description}
            </p>

            {talk.youtubeUrl && (
              <div className="mt-8">
                <Button asChild variant="outline" className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950">
                  <Link href={talk.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Watch on YouTube
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Back to talks link */}
          <div className="mt-10">
            <Link 
              href="/talks" 
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary text-white font-medium rounded-lg transition-colors"
            >
              Back to Talks
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 