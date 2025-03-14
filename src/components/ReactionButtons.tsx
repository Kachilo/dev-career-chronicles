
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Award } from "lucide-react";
import { Reactions } from "../types/blog";
import { useToast } from "@/hooks/use-toast";
import { useBlog } from "../context/BlogContext";

interface ReactionButtonsProps {
  postId: string;
  initialReactions: Reactions;
}

export const ReactionButtons = ({ postId, initialReactions }: ReactionButtonsProps) => {
  const [reactions, setReactions] = useState<Reactions>(initialReactions);
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({
    like: false,
    love: false,
    clap: false
  });
  const { toast } = useToast();
  const { addReaction } = useBlog();

  // Check if user has reacted to this post (based on localStorage)
  useEffect(() => {
    const sessionId = localStorage.getItem("blog-session-id");
    if (sessionId) {
      const storedReactions = localStorage.getItem(`reactions-${postId}`);
      if (storedReactions) {
        setUserReactions(JSON.parse(storedReactions));
      }
    }
  }, [postId]);

  // Update reactions when initialReactions change
  useEffect(() => {
    setReactions(initialReactions);
  }, [initialReactions]);

  const handleReaction = async (type: keyof Reactions) => {
    try {
      // Call the addReaction method from BlogContext
      await addReaction(postId, type);
      
      // Update local state based on previous state
      setUserReactions(prev => {
        const newState = {
          ...prev,
          [type]: !prev[type]
        };
        
        // Save to localStorage
        localStorage.setItem(`reactions-${postId}`, JSON.stringify(newState));
        
        return newState;
      });
      
      // Show toast only when adding a reaction, not when removing
      if (!userReactions[type]) {
        toast({
          title: "Thanks for your reaction!",
          description: `You ${type}d this post.`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
      toast({
        title: "Error",
        description: "Failed to register your reaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={userReactions.like ? "default" : "outline"}
        size="sm"
        onClick={() => handleReaction("like")}
        className="flex items-center gap-1"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{reactions.like}</span>
      </Button>
      
      <Button
        variant={userReactions.love ? "default" : "outline"}
        size="sm"
        onClick={() => handleReaction("love")}
        className="flex items-center gap-1"
      >
        <Heart className="h-4 w-4" />
        <span>{reactions.love}</span>
      </Button>
      
      <Button
        variant={userReactions.clap ? "default" : "outline"}
        size="sm"
        onClick={() => handleReaction("clap")}
        className="flex items-center gap-1"
      >
        <Award className="h-4 w-4" />
        <span>{reactions.clap}</span>
      </Button>
    </div>
  );
};
