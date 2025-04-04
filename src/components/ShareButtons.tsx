
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link2, Copy, MessageCircle, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const { toast } = useToast();
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
      duration: 3000,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: title,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Native Share API (for mobile) */}
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          aria-label="Share"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')}
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4 mr-2" />
        Facebook
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')}
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4 mr-2" />
        X
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank')}
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        WhatsApp
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank')}
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4 mr-2" />
        LinkedIn
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        aria-label="Copy link"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy Link
      </Button>
    </div>
  );
};
