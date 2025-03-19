
import { useState } from "react";
import { useBlog } from "../context/BlogContext";
import { PodcastCard } from "../components/PodcastCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PodcastPlayer } from "../components/PodcastPlayer";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PodcastPage = () => {
  const { podcasts } = useBlog();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<string | null>(null);
  const [podcastsToShow, setPodcastsToShow] = useState(6);
  
  // Get all unique categories
  const categories = Array.from(new Set(podcasts.map(podcast => podcast.category)));
  
  // Sort podcasts by episode number (newest first)
  const sortedPodcasts = [...podcasts].sort((a, b) => 
    b.episodeNumber - a.episodeNumber
  );
  
  // Filter podcasts based on search query and category
  const filteredPodcasts = sortedPodcasts.filter(podcast => {
    const matchesSearch = 
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "all" || podcast.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  const podcastsToDisplay = filteredPodcasts.slice(0, podcastsToShow);
  const hasFeaturedPodcast = podcastsToDisplay.length > 0;
  const featuredPodcast = hasFeaturedPodcast ? podcastsToDisplay[0] : null;
  const regularPodcasts = hasFeaturedPodcast ? podcastsToDisplay.slice(1) : [];
  
  const handlePlayPodcast = (podcastId: string) => {
    setSelectedPodcast(podcastId);
    setIsPlayerOpen(true);
  };
  
  const loadMore = () => {
    setPodcastsToShow(prev => prev + 6);
  };

  const selectedPodcastData = podcasts.find(p => p.id === selectedPodcast);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Already filtering as the user types, so we don't need to do anything here
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Podcast</h1>
        <p className="text-muted-foreground">
          Dive into our audio content where we discuss the latest trends in freelancing, 
          web development, and career growth with industry experts.
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Input
            type="search"
            placeholder="Search podcasts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat} className="capitalize">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Featured Podcast */}
      {featuredPodcast && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Episode</h2>
          <PodcastCard 
            podcast={featuredPodcast} 
            featured={true} 
            onPlay={handlePlayPodcast}
          />
        </section>
      )}
      
      {/* All Podcasts */}
      <section>
        <h2 className="text-2xl font-bold mb-6">All Episodes</h2>
        
        {regularPodcasts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regularPodcasts.map((podcast) => (
              <PodcastCard 
                key={podcast.id} 
                podcast={podcast} 
                onPlay={handlePlayPodcast}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {podcasts.length === 0 ? (
              <p className="text-muted-foreground">No podcast episodes available yet</p>
            ) : (
              <p className="text-muted-foreground">No podcast episodes match your search</p>
            )}
          </div>
        )}
        
        {podcastsToShow < filteredPodcasts.length && (
          <div className="mt-8 text-center">
            <Button
              onClick={loadMore}
              className="inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Load More
            </Button>
          </div>
        )}
      </section>
      
      {/* Podcast Player Dialog */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="sm:max-w-[700px] p-0">
          {selectedPodcastData && (
            <PodcastPlayer 
              podcast={selectedPodcastData} 
              onClose={() => setIsPlayerOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PodcastPage;
