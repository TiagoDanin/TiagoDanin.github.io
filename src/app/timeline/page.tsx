import Link from "next/link";
import timelineData from "@/data/timeline.json";
import { titleToSlug, getRandomColor, toISODate } from '@/utils/parse';

export const metadata = {
  title: "Professional Timeline & Career Journey",
  description: "Career timeline from education to senior mobile developer. Professional milestones, projects, and achievements in mobile development, cybersecurity, and open source.",
  keywords: ["timeline", "career", "professional journey", "work history", "experience", "mobile developer career", "career milestones", "professional background"],
  alternates: {
    canonical: 'https://tiagodanin.com/timeline',
    types: {
      'application/rss+xml': [
        { url: '/rss/timeline.xml', title: 'Timeline RSS Feed' }
      ],
    },
  },
  openGraph: {
    title: "Professional Timeline & Career Journey",
    description: "Career milestones from education to senior mobile developer. Professional journey in mobile development, cybersecurity, and open source.",
    url: "https://tiagodanin.com/timeline",
    type: "profile",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Career Timeline | Tiago Danin",
    description: "Professional journey: education, projects, and career milestones in mobile development.",
    creator: "@tiagodanin",
  },
  other: {
    'application/ld+json': JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": timelineData.map((item) => ({
          "@type": "Event",
          "name": item.title,
          "description": item.description,
          "startDate": toISODate(item.date),
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "location": {
            "@type": "Place",
            "name": item.title
          },
          "organizer": {
            "@type": "Organization",
            "name": item.title
          },
          "performer": {
            "@type": "Person",
            "name": "Tiago Danin"
          },
          "url": `/timeline/${item.date.toString()}/${titleToSlug(item.title)}`,
          "inLanguage": "pt-BR"
        }))
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://tiagodanin.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Timeline",
            "item": "https://tiagodanin.com/timeline"
          }
        ]
      }
    ])
  }
};

const Timeline = () => {
  return (
    <>
      <div className="container mx-auto py-20 px-4 sm:px-6 relative">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 hidden sm:block"></div>
        <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 hidden sm:block"></div>

        <div className="max-w-3xl w-full mx-auto mb-12">
          <h1 className="text-4xl font-bold text-center mb-4">Professional Timeline & Career Journey</h1>
          <p className="text-center text-muted-foreground">
            Career milestones from education to senior mobile developer. Professional journey in mobile development, cybersecurity, and open source.
          </p>
        </div>

        <ol className="relative border-s border-gray-200 dark:border-gray-700 max-w-3xl w-full mx-auto">
          {timelineData.map((item, index) => {
            const year = item.date.toString();
            const slug = titleToSlug(item.title);
            
            return (
              <li key={index} className="mb-10 ms-4">
                {/* Timeline dot */}
                <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                <div className="mb-2">
                  {/* Year tag */}
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    {item.date.toString().includes('-')
                      ? new Date(item.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })
                      : item.date}
                  </span>

                  {/* Tags */}
                  {item.tags && item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`text-sm font-medium px-3 ml-2 py-1 rounded-full ${getRandomColor()}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Content */}
                <Link href={`/timeline/${year}/${slug}`} className="block group">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
};

export default Timeline;