
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Youtube, Presentation } from "lucide-react";
import linksData from "@/data/links.json";

const iconMap = {
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  presentation: Presentation,
};

export default function Links() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-32 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="max-w-md mx-auto">
            {/* Profile Section */}
            <div className="text-center mb-8">
              <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-white shadow-lg">
                <AvatarImage src="https://avatars.githubusercontent.com/u/5731176?v=4" alt="Tiago Danin" />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-green-400 to-emerald-400 text-white">
                  TD
                </AvatarFallback>
              </Avatar>
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Tiago Danin
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Mobile Developer • Bug Hunter
              </p>
            </div>

            {/* Links Section */}
            <div className="space-y-4">
              {linksData.filter((link) => link.enabled).map((link, index) => {
                const IconComponent = iconMap[link.icon as keyof typeof iconMap];
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-14 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-gray-800"
                    asChild
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-6"
                    >
                      <div className="flex items-center gap-3">
                        {IconComponent && (
                          <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {link.title}
                        </span>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}