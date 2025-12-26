import { CallToAction } from "@/components/sections/CallToAction";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { RecentPosts } from "@/components/sections/RecentPosts";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export const metadata = {
  title: "Flutter, React Native & iOS Developer | Tiago Danin",
  description: "Expert mobile developer specializing in Flutter & React Native. Build high-quality iOS/Android apps with full-stack solutions, cybersecurity expertise & professional mentorship.",
  keywords: [
    "Mobile Developer", "Flutter Developer", "React Native Developer",
    "iOS Developer", "Android Developer", "Full Stack Developer",
    "Software Engineer", "Cybersecurity Researcher", "Open Source Contributor",
    "Technical Mentorship", "Cross-Platform Development", "Native Mobile Apps"
  ],
  alternates: {
    canonical: 'https://tiagodanin.com',
  },
  openGraph: {
    title: 'Tiago Danin - Expert Mobile & Full Stack Developer',
    description: 'Expert mobile developer specialized in Flutter, React Native, iOS & Android. Full-stack engineer, cybersecurity researcher, open source contributor & technical mentor.',
    url: 'https://tiagodanin.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiago Danin - Expert Mobile & Full Stack Developer',
    description: 'Mobile developer specializing in Flutter, React Native, iOS & Android. Expert in full-stack development, cybersecurity, open source & mentorship. Let\'s build amazing apps together.',
    creator: '@tiagodanin',
  },
  other: {
    'application/ld+json': JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Tiago Danin",
        "url": "https://tiagodanin.com",
        "image": "https://avatars.githubusercontent.com/u/5731176?v=4",
        "jobTitle": "Mobile Developer",
        "worksFor": {
          "@type": "Organization",
          "name": "Freelancer"
        },
        "description": "Mobile Developer with expertise in Flutter, React Native, iOS, and Android development",
        "knowsAbout": [
          "Mobile Development", "Flutter", "React Native", "iOS Development",
          "Android Development", "Swift", "Kotlin", "Java", "TypeScript",
          "Frontend Development", "Backend Development", "DevOps"
        ],
        "sameAs": [
          "https://github.com/TiagoDanin",
          "https://linkedin.com/in/tiagodanin",
          "https://twitter.com/tiagodanin"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BR"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Tiago Danin",
        "url": "https://tiagodanin.com",
        "description": "Personal website and portfolio of Tiago Danin, Mobile Developer",
        "author": {
          "@type": "Person",
          "name": "Tiago Danin"
        },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://tiagodanin.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What services does Tiago Danin offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tiago Danin offers expert mobile development services including Flutter and React Native app development, native iOS and Android development, cybersecurity consultation, full-stack development, and professional mentorship in game development, AI, and mobile development."
            }
          },
          {
            "@type": "Question",
            "name": "What technologies does Tiago Danin specialize in?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Tiago specializes in Flutter, React Native, Swift (iOS), Kotlin and Java (Android), TypeScript, JavaScript, Node.js, and various mobile development frameworks. He also has expertise in cybersecurity, DevOps, and full-stack development."
            }
          },
          {
            "@type": "Question",
            "name": "Does Tiago Danin offer mentorship services?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Tiago offers personalized 1:1 mentorship in three main areas: game development with Flutter and Bonfire engine, AI development and integration, and mobile development with Flutter and React Native. Mentorship includes weekly video calls and project-based learning."
            }
          }
        ]
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
          }
        ]
      }
    ])
  }
};

const Index = () => {
  return (
    <>
      <Hero />
      <Services />
      <Projects />
      <RecentPosts />
      <Work />
      <CallToAction />
    </>
  );
};

export default Index;