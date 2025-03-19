
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBlog } from "../../context/BlogContext";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Play } from "lucide-react";
import { PodcastEpisode, PodcastTimestamp } from "@/types/blog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PodcastPlayer } from "@/components/PodcastPlayer";
import { v4 as uuidv4 } from "uuid";

const AdminPodcastsPage = () => {
  const { podcasts, addPodcast, updatePodcast, deletePodcast } = useBlog();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPlayerDialogOpen, setIsPlayerDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState<PodcastEpisode | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [duration, setDuration] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("web-development");
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [guestNameInput, setGuestNameInput] = useState("");
  const [timestamps, setTimestamps] = useState<PodcastTimestamp[]>([]);
  const [timestampTime, setTimestampTime] = useState("");
  const [timestampLabel, setTimestampLabel] = useState("");
  
  // Sort podcasts by episode number (newest first)
  const sortedPodcasts = [...podcasts].sort((a, b) => 
    b.episodeNumber - a.episodeNumber
  );
  
  const openAddDialog = () => {
    setTitle("");
    setDescription("");
    setAudioUrl("");
    setEpisodeNumber(podcasts.length > 0 ? Math.max(...podcasts.map(p => p.episodeNumber)) + 1 : 1);
    setDuration("");
    setThumbnailUrl("");
    setCategory("web-development");
    setGuestNames([]);
    setGuestNameInput("");
    setTimestamps([]);
    setTimestampTime("");
    setTimestampLabel("");
    setIsAddDialogOpen(true);
  };
  
  const openEditDialog = (podcast: PodcastEpisode) => {
    setCurrentPodcast(podcast);
    setTitle(podcast.title);
    setDescription(podcast.description);
    setAudioUrl(podcast.audioUrl);
    setEpisodeNumber(podcast.episodeNumber);
    setDuration(podcast.duration);
    setThumbnailUrl(podcast.thumbnailUrl || "");
    setCategory(podcast.category);
    setGuestNames(podcast.guestNames || []);
    setGuestNameInput("");
    setTimestamps(podcast.timestamps || []);
    setTimestampTime("");
    setTimestampLabel("");
    setIsEditDialogOpen(true);
  };
  
  const openDeleteDialog = (podcast: PodcastEpisode) => {
    setCurrentPodcast(podcast);
    setIsDeleteDialogOpen(true);
  };
  
  const openPlayerDialog = (podcast: PodcastEpisode) => {
    setCurrentPodcast(podcast);
    setIsPlayerDialogOpen(true);
  };
  
  const handleAddGuest = () => {
    if (guestNameInput.trim()) {
      setGuestNames(prev => [...prev, guestNameInput.trim()]);
      setGuestNameInput("");
    }
  };
  
  const handleRemoveGuest = (index: number) => {
    setGuestNames(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleAddTimestamp = () => {
    if (timestampTime.trim() && timestampLabel.trim()) {
      setTimestamps(prev => [
        ...prev, 
        { time: timestampTime.trim(), label: timestampLabel.trim() }
      ]);
      setTimestampTime("");
      setTimestampLabel("");
    }
  };
  
  const handleRemoveTimestamp = (index: number) => {
    setTimestamps(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleAddPodcast = async () => {
    if (!title.trim() || !description.trim() || !audioUrl.trim() || !duration.trim() || !category.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      await addPodcast({
        title,
        description,
        audioUrl,
        episodeNumber,
        duration,
        thumbnailUrl,
        category,
        guestNames,
        timestamps
      });
      
      toast({
        title: "Podcast added",
        description: "The podcast has been added successfully."
      });
      
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding podcast:", error);
      toast({
        title: "Error",
        description: "Failed to add the podcast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdatePodcast = async () => {
    if (!currentPodcast) return;
    
    if (!title.trim() || !description.trim() || !audioUrl.trim() || !duration.trim() || !category.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      await updatePodcast(currentPodcast.id, {
        title,
        description,
        audioUrl,
        episodeNumber,
        duration,
        thumbnailUrl,
        category,
        guestNames,
        timestamps
      });
      
      toast({
        title: "Podcast updated",
        description: "The podcast has been updated successfully."
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating podcast:", error);
      toast({
        title: "Error",
        description: "Failed to update the podcast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeletePodcast = async () => {
    if (!currentPodcast) return;
    
    try {
      setIsLoading(true);
      
      await deletePodcast(currentPodcast.id);
      
      toast({
        title: "Podcast deleted",
        description: "The podcast has been deleted successfully."
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting podcast:", error);
      toast({
        title: "Error",
        description: "Failed to delete the podcast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Podcasts</h2>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> New Podcast
        </Button>
      </div>
      
      {podcasts.length === 0 ? (
        <div className="bg-background border rounded-md p-8 text-center">
          <p className="text-muted-foreground mb-4">No podcasts found</p>
          <Button onClick={openAddDialog}>Add your first podcast</Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Ep #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPodcasts.map((podcast) => (
                <TableRow key={podcast.id}>
                  <TableCell className="font-medium">{podcast.episodeNumber}</TableCell>
                  <TableCell>{podcast.title}</TableCell>
                  <TableCell className="capitalize">{podcast.category}</TableCell>
                  <TableCell>{podcast.duration}</TableCell>
                  <TableCell>{formatDate(podcast.uploadDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openPlayerDialog(podcast)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(podcast)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(podcast)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Add Podcast Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Podcast</DialogTitle>
            <DialogDescription>
              Add a new podcast episode to your collection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Podcast title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="episodeNumber">Episode Number *</Label>
                <Input
                  id="episodeNumber"
                  type="number"
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(parseInt(e.target.value))}
                  min={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., web-development"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 45:30"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="audioUrl">Audio URL *</Label>
                <Input
                  id="audioUrl"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="https://example.com/podcast.mp3"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Podcast description"
                  rows={5}
                />
              </div>
            </div>
            
            {/* Guest Names */}
            <div className="space-y-2">
              <Label>Guest Names</Label>
              <div className="flex gap-2">
                <Input
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  placeholder="Guest name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGuest();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddGuest} variant="secondary">
                  Add
                </Button>
              </div>
              
              {guestNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {guestNames.map((name, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveGuest(index)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Timestamps */}
            <div className="space-y-2">
              <Label>Timestamps</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={timestampTime}
                  onChange={(e) => setTimestampTime(e.target.value)}
                  placeholder="Time (e.g., 05:30)"
                />
                <Input
                  value={timestampLabel}
                  onChange={(e) => setTimestampLabel(e.target.value)}
                  placeholder="Description"
                  className="md:col-span-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTimestamp();
                    }
                  }}
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddTimestamp} 
                variant="secondary"
                size="sm"
                className="mt-1"
              >
                Add Timestamp
              </Button>
              
              {timestamps.length > 0 && (
                <div className="mt-2 space-y-1">
                  {timestamps.map((ts, index) => (
                    <div key={index} className="flex items-center justify-between bg-secondary/20 rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{ts.time}</span>
                        <span>{ts.label}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleRemoveTimestamp(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPodcast} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Podcast"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Podcast Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Podcast</DialogTitle>
            <DialogDescription>
              Update the details of this podcast episode.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-episodeNumber">Episode Number *</Label>
                <Input
                  id="edit-episodeNumber"
                  type="number"
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(parseInt(e.target.value))}
                  min={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Input
                  id="edit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Duration *</Label>
                <Input
                  id="edit-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-audioUrl">Audio URL *</Label>
                <Input
                  id="edit-audioUrl"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-thumbnailUrl">Thumbnail URL</Label>
                <Input
                  id="edit-thumbnailUrl"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
            
            {/* Guest Names */}
            <div className="space-y-2">
              <Label>Guest Names</Label>
              <div className="flex gap-2">
                <Input
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                  placeholder="Guest name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGuest();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddGuest} variant="secondary">
                  Add
                </Button>
              </div>
              
              {guestNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {guestNames.map((name, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveGuest(index)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {/* Timestamps */}
            <div className="space-y-2">
              <Label>Timestamps</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={timestampTime}
                  onChange={(e) => setTimestampTime(e.target.value)}
                  placeholder="Time (e.g., 05:30)"
                />
                <Input
                  value={timestampLabel}
                  onChange={(e) => setTimestampLabel(e.target.value)}
                  placeholder="Description"
                  className="md:col-span-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTimestamp();
                    }
                  }}
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddTimestamp} 
                variant="secondary"
                size="sm"
                className="mt-1"
              >
                Add Timestamp
              </Button>
              
              {timestamps.length > 0 && (
                <div className="mt-2 space-y-1">
                  {timestamps.map((ts, index) => (
                    <div key={index} className="flex items-center justify-between bg-secondary/20 rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{ts.time}</span>
                        <span>{ts.label}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleRemoveTimestamp(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePodcast} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Podcast"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the podcast 
              "{currentPodcast?.title}" and remove all its data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePodcast} 
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Podcast Player Dialog */}
      <Dialog open={isPlayerDialogOpen} onOpenChange={setIsPlayerDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0">
          {currentPodcast && (
            <PodcastPlayer 
              podcast={currentPodcast} 
              onClose={() => setIsPlayerDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPodcastsPage;
