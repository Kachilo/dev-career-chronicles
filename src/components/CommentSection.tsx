
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, MessageCircleReply } from "lucide-react";
import { Comment, Reply } from "../types/blog";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, "id" | "date" | "replies">) => void;
  onDeleteComment: (commentId: string) => void;
  onAddReply?: (commentId: string, reply: Omit<Reply, "id" | "date">) => void;
  onDeleteReply?: (commentId: string, replyId: string) => void;
  isAdmin?: boolean;
}

export const CommentSection = ({ 
  postId, 
  comments, 
  onAddComment,
  onDeleteComment,
  onAddReply,
  onDeleteReply,
  isAdmin = false
}: CommentSectionProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyContent, setReplyContent] = useState("");
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
    
    try {
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
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    
    if (!replyName.trim() || !replyContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name and reply.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (onAddReply) {
        onAddReply(commentId, {
          name: replyName.trim(),
          content: replyContent.trim(),
        });
      }
      
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully!",
      });
      
      setReplyName("");
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: "Failed to post your reply. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (commentId: string) => {
    try {
      onDeleteComment(commentId);
      
      toast({
        title: "Comment deleted",
        description: "The comment has been removed.",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete the comment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "some time ago";
    }
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
                      {formatRelativeTime(comment.date)}
                    </p>
                  </div>
                  
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(comment.id)}
                      aria-label="Delete comment"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="mt-2">{comment.content}</p>
                
                {/* Reply button */}
                <div className="mt-3 flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-muted-foreground flex items-center gap-1"
                  >
                    <MessageCircleReply className="h-4 w-4" />
                    <span>Reply</span>
                  </Button>
                </div>
                
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-3 border-l-2 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-muted/50 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-semibold text-sm">{reply.name}</h5>
                            <p className="text-xs text-muted-foreground">
                              {formatRelativeTime(reply.date)}
                            </p>
                          </div>
                          
                          {isAdmin && onDeleteReply && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteReply(comment.id, reply.id)}
                              aria-label="Delete reply"
                              className="h-6 w-6"
                            >
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <p className="mt-1 text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="mt-3 bg-muted/30 p-3 rounded-md">
                    <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="space-y-3">
                      <Input 
                        placeholder="Your name"
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        required
                        className="text-sm"
                      />
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        required
                        rows={2}
                        className="text-sm"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setReplyingTo(null)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" size="sm">
                          Reply
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
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
