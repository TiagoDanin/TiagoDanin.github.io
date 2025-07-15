import { CallToAction } from "@/components/sections/CallToAction";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export const metadata = {
  title: "About",
  description: "Meet Tiago Danin, a Mobile Developer and Bug Hunter with expertise in multiple languages. Explore his projects and join him in building innovative solutions!",
};

const Index = () => {
  return (
    <>
      <Hero />
      <Work />
      <Services />
      <CallToAction />
    </>
  );
};

export default Index;