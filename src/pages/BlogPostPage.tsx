
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { ReactionButtons } from "../components/ReactionButtons";
import { CommentSection } from "../components/CommentSection";
import { ShareButtons } from "../components/ShareButtons";
import { RelatedPosts } from "../components/RelatedPosts";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { BlogPost } from "../types/blog";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, addComment, deleteComment, fetchPosts } = useBlog();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getPostBySlug = async () => {
      if (!slug) return;
      
      setLoading(true);
      try {
        // Try to fetch from Supabase directly
        const { data, error } = await supabase
          .from("posts")
          .select(`
            *,
            comments (*)
          `)
          .eq("slug", slug)
          .single();
        
        if (error) {
          console.error("Error fetching post:", error);
          // If not found in Supabase, check local state
          const localPost = posts.find(p => p.slug === slug);
          if (localPost) {
            setPost(localPost);
          } else {
            navigate("/not-found");
          }
          return;
        }
        
        if (data) {
          // Transform to match BlogPost type
          const transformedPost: BlogPost = {
            id: data.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            featuredImage: data.featured_image,
            category: data.category,
            tags: data.tags,
            author: data.author,
            publishedDate: data.published_date,
            comments: data.comments || [],
            reactions: data.reactions || { like: 0, love: 0, clap: 0 }
          };
          
          setPost(transformedPost);
          
          // Refresh posts list in context to ensure it's up to date
          fetchPosts();
        }
      } catch (err) {
        console.error("Error in getPostBySlug:", err);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };
    
    getPostBySlug();
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [slug, navigate, posts, fetchPosts]);
  
  if (loading) {
    return (
      <div className="container py-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="w-full h-64 md:h-96 rounded-lg" />
          </header>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </article>
      </div>
    );
  }
  
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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <ReactionButtons 
              postId={post.id} 
              initialReactions={post.reactions} 
            />
            
            <ShareButtons title={post.title} url={postUrl} />
          </div>
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
