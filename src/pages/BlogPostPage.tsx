
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { ReactionButtons } from "../components/ReactionButtons";
import { CommentSection } from "../components/CommentSection";
import { ShareButtons } from "../components/ShareButtons";
import { RelatedPosts } from "../components/RelatedPosts";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "../types/blog";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts, loading: allPostsLoading, addComment, deleteComment } = useBlog();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    // Reset state when slug changes
    setLoading(true);
    setError(false);
    
    const fetchPostBySlug = async () => {
      try {
        // First try to fetch directly from Supabase for most up-to-date data
        const { data, error } = await supabase
          .from("posts")
          .select(`
            *,
            comments:comments(*),
            reactions:reactions(*)
          `)
          .eq("slug", slug)
          .single();
        
        if (error) {
          // If not found in database, check if available in loaded posts
          const localPost = posts.find(p => p.slug === slug);
          if (localPost) {
            setPost(localPost);
          } else {
            setError(true);
          }
        } else {
          // Transform the data to match our BlogPost interface
          const reactionCounts = {
            like: 0,
            love: 0,
            clap: 0
          };
          
          // Count reactions by type
          if (data.reactions) {
            data.reactions.forEach((reaction: any) => {
              if (reaction.type in reactionCounts) {
                reactionCounts[reaction.type as keyof typeof reactionCounts]++;
              }
            });
          }
          
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
            comments: data.comments.map((comment: any) => ({
              id: comment.id,
              name: comment.name,
              content: comment.content,
              date: comment.date
            })),
            reactions: reactionCounts
          };
          
          setPost(transformedPost);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (slug) {
      fetchPostBySlug();
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [slug, posts]);
  
  // Redirect to not-found page if post is not found and not loading
  useEffect(() => {
    if (!loading && !post && slug) {
      navigate("/not-found");
    }
  }, [post, loading, slug, navigate]);
  
  if (loading || allPostsLoading) {
    return (
      <div className="container py-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Skeleton className="h-8 w-24 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-6 w-16" />
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
