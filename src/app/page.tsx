import { CallToAction } from "@/components/sections/CallToAction";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { RecentPosts } from "@/components/sections/RecentPosts";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export const metadata = {
  title: "Home",
  description: "Mobile Developer with expertise in Java, Kotlin, Obj-C, Swift, React Native, and Flutter, also experienced in front-end, back-end, and desktop development for macOS & Linux. Passionate about open source, automation, and solving real-world problems, always looking for new challenges.",
  openGraph: {
    title: "Tiago Danin - Mobile Developer & Software Engineer",
    description: "Mobile Developer specialized in Flutter, React Native, iOS and Android development. Open source contributor with experience in full-stack development.",
    url: "https://tiagodanin.com",
    type: "website",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Tiago Danin",
  "url": "https://tiagodanin.com",
  "image": "https://tiagodanin.com/images/tiago-danin.jpg",
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
};

const websiteSchema = {
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
};

const Index = () => {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} 
      />
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