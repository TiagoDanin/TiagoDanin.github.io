import { CallToAction } from "@/components/sections/CallToAction";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export const metadata = {
  title: "About",
  description: "Learn about Tiago Danin, mobile developer with expertise in Flutter, React Native, iOS, and Android. Bug hunter, open source contributor, and mentor.",
  alternates: {
    canonical: 'https://tiagodanin.com/about',
  },
  openGraph: {
    title: "About Tiago Danin - Mobile Developer & Security Researcher",
    description: "Mobile developer with expertise in Flutter, React Native, iOS, and Android. HackerOne bug hunter and open source contributor.",
    url: "https://tiagodanin.com/about",
    type: "profile",
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Tiago Danin - Mobile Developer & Security Researcher",
    description: "Mobile developer with expertise in Flutter, React Native, iOS, and Android.",
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "mainEntity": {
    "@type": "Person",
    "name": "Tiago Danin",
    "description": "Mobile Developer and Bug Hunter with expertise in multiple programming languages and frameworks",
    "url": "https://tiagodanin.com",
    "jobTitle": "Mobile Developer",
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