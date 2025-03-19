
import { useState } from "react";
import { BlogCard } from "./BlogCard";
import { PodcastCard } from "./PodcastCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBlog } from "../context/BlogContext";
import { Dialog, DialogContent } from "./ui/dialog";
import { PodcastPlayer } from "./PodcastPlayer";

export const FeaturedContent = () => {
  const { posts, podcasts } = useBlog();
  const [activeTab, setActiveTab] = useState("blogs");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<string | null>(null);
  
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
  
  // Sort podcasts by episode number (newest first)
  const sortedPodcasts = [...podcasts].sort((a, b) => 
    b.episodeNumber - a.episodeNumber
  );
  
  const featuredPosts = sortedPosts.slice(0, 3);
  const featuredPodcasts = sortedPodcasts.slice(0, 3);
  
  const handlePlayPodcast = (podcastId: string) => {
    setSelectedPodcast(podcastId);
    setIsPlayerOpen(true);
  };
  
  const selectedPodcastData = podcasts.find(p => p.id === selectedPodcast);

  return (
    <section className="py-12 bg-muted/30 rounded-lg px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Content</h2>
        </div>
        
        <Tabs defaultValue="blogs" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="blogs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
              
              {featuredPosts.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No blog posts available yet</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="podcasts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPodcasts.map((podcast) => (
                <PodcastCard 
                  key={podcast.id} 
                  podcast={podcast} 
                  onPlay={handlePlayPodcast}
                />
              ))}
              
              {featuredPodcasts.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No podcasts available yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
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
    </section>
  );
};
