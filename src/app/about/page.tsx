import { CallToAction } from "@/components/sections/CallToAction";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export const metadata = {
  title: "About",
  description: "Meet Tiago Danin, a Mobile Developer and Bug Hunter with expertise in multiple languages. Explore his projects and join him in building innovative solutions!",
  openGraph: {
    title: "About Tiago Danin - Mobile Developer & Software Engineer",
    description: "Learn more about Tiago Danin, a passionate Mobile Developer with expertise in Flutter, React Native, iOS, and Android development.",
    url: "https://tiagodanin.com/about",
    type: "website",
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