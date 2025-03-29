import { CallToAction } from "@/components/sections/CallToAction";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { RecentPosts } from "@/components/sections/RecentPosts";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";

export const metadata = {
  title: "Tiago Danin",
  description: "I'm a Mobile Developer with expertise in Java, Kotlin, Obj-C, Swift, React Native, and Flutter, also experienced in front-end, back-end, and desktop development for macOS & Linux. Passionate about open source, automation, and solving real-world problems, always looking for new challenges. Currently diving into Digital Marketing to expand my knowledge beyond coding.",
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