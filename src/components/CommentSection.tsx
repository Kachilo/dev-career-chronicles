
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Trash2 } from "lucide-react";
import { Comment } from "../types/blog";
import { useToast } from "@/hooks/use-toast";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, "id" | "date">) => void;
  onDeleteComment: (commentId: string) => void;
  isAdmin?: boolean;
}

export const CommentSection = ({ 
  postId, 
  comments, 
  onAddComment,
  onDeleteComment,
  isAdmin = false
}: CommentSectionProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name and comment.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      onAddComment({
        name: name.trim(),
        content: content.trim(),
      });
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully!",
      });
      
      setName("");
      setContent("");
      setIsSubmitting(false);
    }, 500);
  };

  const handleDelete = (commentId: string) => {
    onDeleteComment(commentId);
    
    toast({
      title: "Comment deleted",
      description: "The comment has been removed.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-xl font-bold">
          Comments ({comments.length})
        </h3>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Leave a comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{comment.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(comment.date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(comment.id)}
                      aria-label="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="mt-2">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}
    </div>
  );
};
