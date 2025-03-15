
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Award } from "lucide-react";
import { Reactions } from "../types/blog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../integrations/supabase/client";

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

  // Load user reactions from local storage on component mount
  useEffect(() => {
    const savedReactions = localStorage.getItem(`userReactions-${postId}`);
    if (savedReactions) {
      setUserReactions(JSON.parse(savedReactions));
    }
  }, [postId]);

  const handleReaction = async (type: keyof Reactions) => {
    try {
      const newUserReactions = {
        ...userReactions,
        [type]: !userReactions[type]
      };
      
      const newReactions = { ...reactions };
      
      if (newUserReactions[type]) {
        // Add reaction
        newReactions[type] = reactions[type] + 1;
        
        toast({
          title: "Thanks for your reaction!",
          description: `You ${type}d this post.`,
          duration: 2000,
        });
      } else {
        // Remove reaction
        newReactions[type] = Math.max(0, reactions[type] - 1);
      }

      // Save reactions to local storage
      localStorage.setItem(`userReactions-${postId}`, JSON.stringify(newUserReactions));
      setUserReactions(newUserReactions);
      setReactions(newReactions);

      // Update reactions in Supabase
      const { error } = await supabase
        .from("posts")
        .update({ reactions: newReactions })
        .eq("id", postId);

      if (error) {
        console.error("Error updating reactions:", error);
        toast({
          title: "Error",
          description: "Failed to update reaction. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to handle reaction:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
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
