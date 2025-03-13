
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare } from "lucide-react";
import { BlogPost } from "../types/blog";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const commentCount = post.comments.length;
  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${featured ? 'lg:flex' : ''}`}>
      <div className={`${featured ? 'lg:w-2/5' : 'w-full'}`}>
        <Link to={`/blog/${post.slug}`}>
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className={`w-full h-48 object-cover ${featured ? 'lg:h-full' : ''}`}
          />
        </Link>
      </div>
      
      <div className={`${featured ? 'lg:w-3/5' : 'w-full'}`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="capitalize">
              {post.category}
            </Badge>
          </div>
          <Link to={`/blog/${post.slug}`}>
            <h3 className={`font-bold hover:text-primary transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
              {post.title}
            </h3>
          </Link>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center">
            <MessageSquare className="mr-1 h-4 w-4" />
            <span>{commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};
