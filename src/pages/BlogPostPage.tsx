
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { CommentSection } from "../components/CommentSection";
import { ShareButtons } from "../components/ShareButtons";
import { RelatedPosts } from "../components/RelatedPosts";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, getPostBySlug, addComment, deleteComment } = useBlog();
  const navigate = useNavigate();
  
  const post = getPostBySlug(slug || "");
  
  useEffect(() => {
    if (!post && slug) {
      navigate("/not-found");
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [post, slug, navigate]);
  
  if (!post) {
    return null;
  }
  
  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get the current URL for sharing
  const postUrl = window.location.href;

  return (
    <div className="container py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4 capitalize">
            {post.category}
          </Badge>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-4">
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              <span>{post.author}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </header>
        
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div className="mt-8 pt-6 border-t">
          <ShareButtons title={post.title} url={postUrl} />
        </div>
        
        <div className="mt-12">
          <CommentSection 
            postId={post.id}
            comments={post.comments}
            onAddComment={(comment) => addComment(post.id, comment)}
            onDeleteComment={(commentId) => deleteComment(post.id, commentId)}
          />
        </div>
        
        <RelatedPosts currentPostId={post.id} posts={posts} />
      </article>
    </div>
  );
};

export default BlogPostPage;
