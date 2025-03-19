
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, Clock, Play } from "lucide-react";
import { PodcastEpisode } from "../types/blog";
import { Button } from "./ui/button";

interface PodcastCardProps {
  podcast: PodcastEpisode;
  featured?: boolean;
  onPlay?: (podcastId: string) => void;
}

export const PodcastCard = ({ podcast, featured = false, onPlay }: PodcastCardProps) => {
  const commentCount = podcast.comments.length;
  const formattedDate = new Date(podcast.uploadDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onPlay) {
      onPlay(podcast.id);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${featured ? 'lg:flex' : ''}`}>
      <div className={`${featured ? 'lg:w-2/5' : 'w-full'} relative`}>
        <Link to={`/podcast/${podcast.id}`}>
          <img 
            src={podcast.thumbnailUrl || `https://picsum.photos/seed/podcast-${podcast.id}/300/200`} 
            alt={podcast.title} 
            className={`w-full h-48 object-cover ${featured ? 'lg:h-full' : ''}`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              onClick={handlePlay}
              size="icon"
              variant="secondary"
              className="rounded-full bg-primary/90 text-primary-foreground hover:bg-primary w-12 h-12 flex items-center justify-center"
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>
        </Link>
      </div>
      
      <div className={`${featured ? 'lg:w-3/5' : 'w-full'}`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="capitalize">
              Episode {podcast.episodeNumber}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {podcast.category}
            </Badge>
          </div>
          <Link to={`/podcast/${podcast.id}`}>
            <h3 className={`font-bold hover:text-primary transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
              {podcast.title}
            </h3>
          </Link>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground line-clamp-3">
            {podcast.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{podcast.duration}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <MessageSquare className="mr-1 h-4 w-4" />
            <span>{commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};
