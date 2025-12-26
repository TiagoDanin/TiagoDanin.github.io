import { CallToAction } from "@/components/sections/CallToAction";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export const metadata = {
  title: "Mobile Developer & Bug Hunter | Portfolio",
  description: "Mobile developer specializing in Flutter, React Native & native iOS/Android. Bug hunter, open source contributor, mentorship expert. Let's build something amazing together.",
  keywords: ["Mobile Developer", "Flutter Developer", "React Native Developer", "iOS Developer", "Android Developer", "Bug Hunter", "Open Source Contributor", "Security Researcher", "Technical Mentor"],
  alternates: {
    canonical: 'https://tiagodanin.com/about',
  },
  openGraph: {
    title: "Tiago Danin - Mobile Developer & Bug Hunter",
    description: "Mobile developer specializing in Flutter, React Native & native iOS/Android. Open source contributor, security researcher, and mentor. Let's build together.",
    url: "https://tiagodanin.com/about",
    type: "profile",
    profile: {
      firstName: "Tiago",
      lastName: "Danin",
      username: "tiagodanin",
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Tiago Danin - Mobile Developer",
    description: "Flutter expert, React Native developer, security researcher & bug hunter. Open source advocate. Crafting innovative mobile solutions.",
    creator: '@tiagodanin',
    site: '@tiagodanin',
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "mainEntity": {
        "@type": "Person",
        "name": "Tiago Danin",
        "url": "https://tiagodanin.com",
        "image": "https://avatars.githubusercontent.com/u/5731176?v=4",
        "description": "Full-stack mobile developer specializing in Flutter, React Native, and native iOS/Android development",
        "jobTitle": "Mobile Developer & Security Researcher",
        "worksFor": {
          "@type": "Organization",
          "name": "Freelance / Independent"
        },
        "sameAs": [
          "https://github.com/TiagoDanin",
          "https://twitter.com/tiagodanin",
          "https://linkedin.com/in/tiagodanin",
          "https://hackerone.com/tiago-danin"
        ],
        "knowsAbout": [
          "Flutter",
          "React Native",
          "Swift",
          "Kotlin",
          "iOS Development",
          "Android Development",
          "Cybersecurity",
          "DevOps"
        ],
        "skills": [
          "Mobile Application Development",
          "Cross-platform Development",
          "Security Testing",
          "Open Source Development"
        ],
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Mobile Application Developer",
          "occupationLocation": {
            "@type": "Country",
            "name": "Brazil"
          },
          "description": "Develops mobile applications using Flutter, React Native, and native iOS/Android technologies"
        }
      }
    },
    {
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
          "name": "About",
          "item": "https://tiagodanin.com/about"
        }
      ]
    }
  ]
};

const Index = () => {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} 
      />
      <Hero />
      <Work />
      <Services />
      <CallToAction />
    </>
  );
};

export default Index;