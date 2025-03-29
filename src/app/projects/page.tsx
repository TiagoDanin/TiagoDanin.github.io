import { Projects } from "@/components/sections/Projects";
import { FullProjects } from "@/components/sections/FullProjects";

export const metadata = {
  title: "Projects",
  description: "Explore my portfolio of projects and open source contributions",
};

const Index = () => {
  return (
    <div>
      <Projects />
      <FullProjects />
    </div>
  );
};

export default Index;