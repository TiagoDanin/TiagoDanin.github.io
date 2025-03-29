import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  href?: string;
  archived?: boolean;
}

export function ProjectCard({ title, description, imageUrl, href, archived }: ProjectCardProps) {
  const { toast } = useToast();

  const handleClick = () => {
    if (href) {
      window.open(href, '_blank');
    } else {
      toast({
        description: "No link available for this project.",
      });
    }
  };

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-lg cursor-pointer" 
      onClick={handleClick}
    >
      {imageUrl && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          {href && <ExternalLink className="h-4 w-4 text-muted-foreground" />}
          {archived && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Archived
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}