
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Comment } from "../types/blog";
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, "id" | "date" | "replies">) => void;
  onDeleteComment: (commentId: string) => void;
}

export const CommentSection = ({
  postId,
  comments,
  onAddComment,
  onDeleteComment,
}: CommentSectionProps) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() === "" || content.trim() === "") {
      return;
    }
    
    onAddComment({ name, content });
    setName("");
    setContent("");
  };

  const handleReplySubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    
    if (replyName.trim() === "" || replyContent.trim() === "") {
      return;
    }
    
    // Here we would normally call something like onAddReply
    // But since we don't have that functionality yet, we'll add a comment mentioning the reply
    const replyText = `@${commentId.substring(0, 6)} - ${replyContent}`;
    onAddComment({ name: replyName, content: replyText });
    
    setReplyingTo(null);
    setReplyName("");
    setReplyContent("");
  };

  const formatCommentTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "some time ago";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[100px] w-full"
            />
          </div>
          
          <Button type="submit">Post Comment</Button>
        </div>
      </form>
      
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{comment.name}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCommentTime(comment.date)}
                </div>
              </div>
              
              <p className="mb-3">{comment.content}</p>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  {replyingTo === comment.id ? "Cancel" : "Reply"}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  Delete
                </Button>
              </div>
              
              {replyingTo === comment.id && (
                <form 
                  onSubmit={(e) => handleReplySubmit(e, comment.id)} 
                  className="mt-4 pl-4 border-l-2 border-gray-200"
                >
                  <div className="space-y-3">
                    <div>
                      <Input
                        type="text"
                        placeholder="Your Name"
                        value={replyName}
                        onChange={(e) => setReplyName(e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <Textarea
                        placeholder="Your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        required
                        className="min-h-[80px] w-full"
                      />
                    </div>
                    
                    <Button type="submit" size="sm">Submit Reply</Button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          No comments yet. Be the first to comment!
        </div>
      )}
    </div>
  );
};
