
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { PodcastPlayer } from "../components/PodcastPlayer";
import { BlogBreadcrumb } from "../components/BlogBreadcrumb";
import { ShareButtons } from "../components/ShareButtons";
import { Calendar, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const PodcastDetailPage = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const { podcasts, addPodcastComment, likePodcastComment, dislikePodcastComment, incrementPodcastViews } = useBlog();
  const podcast = podcasts.find(p => p.id === podcastId);
  const { toast } = useToast();
  
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (podcast) {
      // Increment view count
      incrementPodcastViews(podcast.id);
      
      // Set page title
      document.title = `${podcast.title} - DevInsights Podcast`;
    }
    
    return () => {
      document.title = "DevInsights";
    };
  }, [podcast, incrementPodcastViews]);
  
  if (!podcast) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Podcast Not Found</h1>
        <p className="mb-6">The podcast episode you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/podcast">Back to Podcasts</Link>
        </Button>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentName.trim() || !commentContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name and comment",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await addPodcastComment(podcast.id, {
        name: commentName,
        content: commentContent
      });
      
      setCommentName("");
      setCommentContent("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully."
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add your comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLikeComment = async (commentId: string) => {
    try {
      await likePodcastComment(podcast.id, commentId);
    } catch (error) {
      console.error("Error liking comment:", error);
      toast({
        title: "Error",
        description: "Failed to like the comment.",
        variant: "destructive"
      });
    }
  };
  
  const handleDislikeComment = async (commentId: string) => {
    try {
      await dislikePodcastComment(podcast.id, commentId);
    } catch (error) {
      console.error("Error disliking comment:", error);
      toast({
        title: "Error",
        description: "Failed to dislike the comment.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container py-8">
      <BlogBreadcrumb 
        items={[
          { title: "Home", href: "/" },
          { title: "Podcasts", href: "/podcast" },
          { title: podcast.title, href: `/podcast/${podcast.id}` }
        ]}
      />
      
      <div className="max-w-4xl mx-auto mt-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Episode {podcast.episodeNumber}</Badge>
            <Badge>{podcast.category}</Badge>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold">{podcast.title}</h1>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(podcast.uploadDate)}</span>
            </div>
            {podcast.guestNames && podcast.guestNames.length > 0 && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>Guests: {podcast.guestNames.join(", ")}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{podcast.duration}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 mb-8">
          <PodcastPlayer podcast={podcast} />
        </div>
        
        <Separator className="my-8" />
        
        <div className="prose dark:prose-invert max-w-none">
          <h2>About this episode</h2>
          <div className="whitespace-pre-line">{podcast.description}</div>
        </div>
        
        <Separator className="my-8" />
        
        <ShareButtons title={podcast.title} />
        
        <Separator className="my-8" />
        
        {/* Comments Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments ({podcast.comments.length})</h2>
          
          <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
            <div>
              <Input
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Textarea
                placeholder="Share your thoughts on this episode..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full min-h-24"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Post Comment"}
            </Button>
          </form>
          
          <div className="space-y-6">
            {podcast.comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              podcast.comments.map((comment) => (
                <div key={comment.id} className="bg-card/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {comment.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium">{comment.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(comment.date)}
                        </div>
                      </div>
                      <p className="text-sm mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikeComment(comment.id)}
                          className="text-xs h-8 px-2"
                        >
                          👍 {comment.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDislikeComment(comment.id)}
                          className="text-xs h-8 px-2"
                        >
                          👎 {comment.dislikes}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PodcastDetailPage;
