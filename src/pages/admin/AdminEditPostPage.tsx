
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { PostForm } from "../../components/admin/PostForm";
import { BlogPost } from "../../types/blog";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const AdminEditPostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts, updatePost, fetchPosts } = useBlog();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getPostById = async () => {
      if (!postId) return;
      
      setLoading(true);
      
      // First check if the post is in our local state
      const localPost = posts.find(p => p.id === postId);
      if (localPost) {
        setPost(localPost);
        setLoading(false);
        return;
      }
      
      // If not, fetch it from Supabase
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(`
            *,
            comments (*)
          `)
          .eq("id", postId)
          .single();
        
        if (error) {
          console.error("Error fetching post:", error);
          toast.error("Failed to load post");
          navigate("/admin/posts");
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
          
          // Refresh posts list in context
          fetchPosts();
        }
      } catch (err) {
        console.error("Error in getPostById:", err);
        toast.error("Failed to load post");
        navigate("/admin/posts");
      } finally {
        setLoading(false);
      }
    };
    
    getPostById();
  }, [postId, posts, navigate, fetchPosts]);
  
  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
        <div className="border rounded-lg p-6">
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return null;
  }

  const handleUpdatePost = async (postData: any) => {
    try {
      await updatePost(post.id, postData);
      toast.success("Post updated successfully!");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
      <PostForm post={post} onSave={handleUpdatePost} />
    </div>
  );
};

export default AdminEditPostPage;
