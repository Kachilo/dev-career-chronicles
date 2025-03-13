
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Clap } from "lucide-react";
import { Reactions } from "../types/blog";
import { useToast } from "@/hooks/use-toast";

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

  const handleReaction = (type: keyof Reactions) => {
    if (userReactions[type]) {
      // Remove reaction
      setReactions(prev => ({
        ...prev,
        [type]: Math.max(0, prev[type] - 1)
      }));
      setUserReactions(prev => ({
        ...prev,
        [type]: false
      }));
    } else {
      // Add reaction
      setReactions(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));
      setUserReactions(prev => ({
        ...prev,
        [type]: true
      }));
      
      toast({
        title: "Thanks for your reaction!",
        description: `You ${type}d this post.`,
        duration: 2000,
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
        <Clap className="h-4 w-4" />
        <span>{reactions.clap}</span>
      </Button>
    </div>
  );
};
