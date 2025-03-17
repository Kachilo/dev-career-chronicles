
import { AffiliateLink } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface AffiliateProductsProps {
  links: AffiliateLink[];
  category?: string;
}

export const AffiliateProducts = ({ links, category }: AffiliateProductsProps) => {
  // Filter by category if provided
  const filteredLinks = category 
    ? links.filter(link => link.category === category)
    : links;
    
  if (filteredLinks.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-primary" />
          Recommended Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredLinks.map((link) => (
            <Card key={link.id} className="overflow-hidden border">
              <div className="aspect-video relative">
                <img 
                  src={link.imageUrl} 
                  alt={link.title}
                  className="object-cover w-full h-full" 
                />
              </div>
              <div className="p-3 space-y-2">
                <h3 className="font-medium text-sm">{link.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {link.description}
                </p>
                <Button 
                  size="sm" 
                  className="w-full" 
                  variant="secondary"
                  onClick={() => window.open(link.linkUrl, '_blank')}
                >
                  Check it out
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
