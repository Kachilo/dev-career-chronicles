
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Podcast, Play, Pencil, Trash } from "lucide-react";
import { useBlog } from "@/context/BlogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { PodcastUploader } from "@/components/PodcastUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { PodcastEpisode } from "@/types/blog";
import { ShareButtons } from "@/components/ShareButtons";

const AdminPodcastsPage = () => {
  const navigate = useNavigate();
  const { podcasts, addPodcast, deletePodcast } = useBlog();
  const [isAddingPodcast, setIsAddingPodcast] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [guests, setGuests] = useState("");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastEpisode | null>(null);
  
  // Form validation
  const isFormValid = title && description && audioFile && category;
  
  const handleAudioUpload = (file: File) => {
    setAudioFile(file);
  };
  
  const handleRemoveAudio = () => {
    setAudioFile(null);
  };
  
  const handleThumbnailUpload = (file: File) => {
    setThumbnailFile(file);
  };
  
  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
  };
  
  const handleSubmit = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // Create a URL for the audio file
      const audioUrl = URL.createObjectURL(audioFile!);
      
      // Create a URL for the thumbnail file if it exists
      const thumbnailUrl = thumbnailFile 
        ? URL.createObjectURL(thumbnailFile) 
        : undefined;
      
      // Process guest names if provided
      const guestNames = guests.trim() ? guests.split(',').map(g => g.trim()) : undefined;
      
      // Add the podcast
      await addPodcast({
        title,
        description,
        audioUrl,
        episodeNumber,
        duration: "10:00",  // Default duration
        thumbnailUrl,
        guestNames,
        category,
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setAudioFile(null);
      setThumbnailFile(null);
      setEpisodeNumber(podcasts.length + 1);
      setGuests("");
      setCategory("general");
      
      // Close the form
      setIsAddingPodcast(false);
      
      // Show success message
      toast.success("Podcast published successfully!");
      
      // Force reload to refresh the podcast list
      window.location.reload();
    } catch (error) {
      console.error("Error publishing podcast:", error);
      toast.error("Failed to publish podcast. Please try again.");
    }
  };
  
  const handlePreview = (podcast: PodcastEpisode) => {
    setSelectedPodcast(podcast);
    setIsPlayerOpen(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this podcast?")) {
      deletePodcast(id);
      toast.success("Podcast deleted successfully");
    }
  };
  
  // Sort podcasts by episode number (newest first)
  const sortedPodcasts = [...podcasts].sort((a, b) => 
    b.episodeNumber - a.episodeNumber
  );
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Podcasts</h1>
        
        <Button onClick={() => setIsAddingPodcast(true)} className="bg-primary text-white">
          <Mic className="mr-2 h-4 w-4" />
          Publish Podcast
        </Button>
      </div>
      
      {/* Podcasts Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Upload Date</TableHead>
              <TableHead className="hidden md:table-cell">Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPodcasts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  No podcasts found. Click "Publish Podcast" to add your first episode.
                </TableCell>
              </TableRow>
            ) : (
              sortedPodcasts.map((podcast) => (
                <TableRow key={podcast.id}>
                  <TableCell>{podcast.episodeNumber}</TableCell>
                  <TableCell className="flex items-center gap-3">
                    {podcast.thumbnailUrl ? (
                      <img 
                        src={podcast.thumbnailUrl} 
                        alt={podcast.title} 
                        className="w-10 h-10 rounded object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        <Podcast className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <span className="line-clamp-1">{podcast.title}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{podcast.category}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(podcast.uploadDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{podcast.views}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handlePreview(podcast)}
                        title="Preview"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => navigate(`/podcast/${podcast.id}`)}
                        title="View"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDelete(podcast.id)}
                        title="Delete"
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Podcast Sheet */}
      <Sheet open={isAddingPodcast} onOpenChange={setIsAddingPodcast}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Publish New Podcast</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input 
                id="title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Enter podcast title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="web-development">Web Development</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="episode">Episode Number</Label>
              <Input 
                id="episode" 
                type="number" 
                value={episodeNumber} 
                onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)} 
                min={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter podcast description"
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guests">Guest Names (comma-separated)</Label>
              <Input 
                id="guests" 
                value={guests} 
                onChange={(e) => setGuests(e.target.value)} 
                placeholder="Enter guest names, separated by commas"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Podcast Audio <span className="text-destructive">*</span></Label>
              <PodcastUploader
                onFileSelected={handleAudioUpload}
                onFileRemoved={handleRemoveAudio}
                type="audio"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Podcast Thumbnail</Label>
              <PodcastUploader
                onFileSelected={handleThumbnailUpload}
                onFileRemoved={handleRemoveThumbnail}
                type="image"
                accept="image/*"
                maxSizeMB={5}
              />
            </div>
          </div>
          
          <SheetFooter>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="w-full"
            >
              Publish Podcast
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Podcast Preview Dialog */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Preview Podcast</DialogTitle>
          </DialogHeader>
          
          {selectedPodcast && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {selectedPodcast.thumbnailUrl && (
                  <img 
                    src={selectedPodcast.thumbnailUrl} 
                    alt={selectedPodcast.title} 
                    className="w-24 h-24 rounded-md object-cover"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{selectedPodcast.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Episode {selectedPodcast.episodeNumber}
                  </p>
                </div>
              </div>
              
              <audio 
                controls 
                src={selectedPodcast.audioUrl} 
                className="w-full"
              ></audio>
              
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm">{selectedPodcast.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Share</h4>
                <ShareButtons 
                  title={selectedPodcast.title} 
                  url={`${window.location.origin}/podcast/${selectedPodcast.id}`}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPodcastsPage;
