import GitHubPagesSection from "@/components/sections/GitHubPages";

export const metadata = {
  title: "GitHub Pages",
  description: "Browse all my GitHub Pages projects and live demos",
};

const Index = () => {
  return (
    <div>
      <GitHubPagesSection />
    </div>
  );
};

export default Index;
