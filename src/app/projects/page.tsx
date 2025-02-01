import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Projects } from "@/components/sections/Projects";
import { FullProjects } from "@/components/sections/FullProjects";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Projects />

        <FullProjects />
      </main>
      <Footer />
    </div>
  );
};

export default Index;