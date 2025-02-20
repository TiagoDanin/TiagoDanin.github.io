import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Work } from "@/components/sections/Work";

export const metadata = {
  title: "Home",
  description: "Welcome to Tiago Danin's portfolio - Mobile Developer and Full Stack Engineer",
};

const Index = () => {
  return (
    <>
      <Hero />
      <Work />
      <Projects />
    </>
  );
};

export default Index;