
import { Link } from "react-router-dom";
import { BlogPost } from "@/types/blog";
import { TrendingUp, Eye, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendingPostsProps {
  posts: BlogPost[];
}

export const TrendingPosts = ({ posts }: TrendingPostsProps) => {
  // Sort posts by views and limit to top 4
  const trendingPosts = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  if (trendingPosts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-primary h-5 w-5" />
        <h2 className="text-xl font-bold">Trending Posts</h2>
      </div>
      
      <div className="space-y-4">
        {trendingPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <Link 
              to={`/blog/${post.slug}`}
              className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
            >
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-16 h-16 rounded-md object-cover flex-shrink-0" 
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2">{post.title}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {post.category}
                  </Badge>
                  
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{post.views || 0}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};
