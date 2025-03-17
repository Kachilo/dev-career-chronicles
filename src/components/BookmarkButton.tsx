
import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface BookmarkButtonProps {
  postId: string;
  title: string;
}

export const BookmarkButton = ({ postId, title }: BookmarkButtonProps) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();
  
  const STORAGE_KEY = "bookmarked_posts";
  
  useEffect(() => {
    // Check if this post is already bookmarked
    const bookmarkedPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setIsBookmarked(bookmarkedPosts.some((post: any) => post.id === postId));
  }, [postId]);
  
  const handleBookmark = () => {
    const bookmarkedPosts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    
    if (isBookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarkedPosts.filter((post: any) => post.id !== postId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      
      toast({
        title: "Bookmark removed",
        description: "This post has been removed from your bookmarks.",
        duration: 3000,
      });
    } else {
      // Add bookmark
      const newBookmark = {
        id: postId,
        title,
        bookmarkedAt: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...bookmarkedPosts, newBookmark]));
      setIsBookmarked(true);
      
      toast({
        title: "Post bookmarked",
        description: "This post has been added to your bookmarks.",
        duration: 3000,
      });
    }
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleBookmark}
      className="flex items-center gap-1"
    >
      {isBookmarked ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:ml-1">Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:ml-1">Bookmark</span>
        </>
      )}
    </Button>
  );
};
