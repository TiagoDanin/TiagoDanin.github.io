import GitHubPagesSection from "@/components/sections/GitHubPages";

export const metadata = {
  title: "GitHub Pages",
  description: "Browse all GitHub Pages projects and live demos by Tiago Danin. Interactive demos, tools, and open source project showcases.",
  keywords: ["GitHub Pages", "live demos", "projects", "interactive demos", "open source"],
  alternates: {
    canonical: 'https://tiagodanin.com/github-pages',
  },
  openGraph: {
    title: "GitHub Pages Projects - Tiago Danin",
    description: "Interactive demos, tools, and open source project showcases hosted on GitHub Pages.",
    url: "https://tiagodanin.com/github-pages",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "GitHub Pages Projects - Tiago Danin",
    description: "Interactive demos and tools hosted on GitHub Pages.",
  },
};

const Index = () => {
  return (
    <div>
      <GitHubPagesSection />
    </div>
  );
};

export default Index;
