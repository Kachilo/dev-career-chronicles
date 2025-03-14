
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { BlogPost, Comment } from "../types/blog";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

interface BlogContextProps {
  posts: BlogPost[];
  loading: boolean;
  addPost: (post: Omit<BlogPost, "id" | "comments" | "reactions">) => Promise<void>;
  updatePost: (postId: string, postData: Partial<BlogPost>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  addComment: (postId: string, comment: Omit<Comment, "id" | "date">) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  fetchPosts: () => Promise<void>;
}

const BlogContext = createContext<BlogContextProps | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider = ({ children }: BlogProviderProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          comments (*)
        `)
        .order("published_date", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Transform data to match our BlogPost type
        const transformedPosts: BlogPost[] = data.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.featured_image,
          category: post.category,
          tags: post.tags,
          author: post.author,
          publishedDate: post.published_date,
          comments: post.comments || [],
          reactions: post.reactions || { like: 0, love: 0, clap: 0 }
        }));

        setPosts(transformedPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  // Initialize posts from Supabase
  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (post: Omit<BlogPost, "id" | "comments" | "reactions">) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featured_image: post.featuredImage,
          category: post.category,
          tags: post.tags,
          author: post.author,
          published_date: post.publishedDate || new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newPost: BlogPost = {
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
          comments: [],
          reactions: { like: 0, love: 0, clap: 0 }
        };
        
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      }
    } catch (error) {
      console.error("Error adding post:", error);
      toast.error("Failed to create post");
      throw error;
    }
  };

  const updatePost = async (postId: string, postData: Partial<BlogPost>) => {
    try {
      // Transform BlogPost type to database schema
      const dbData: any = {};
      
      if (postData.title) dbData.title = postData.title;
      if (postData.slug) dbData.slug = postData.slug;
      if (postData.excerpt) dbData.excerpt = postData.excerpt;
      if (postData.content) dbData.content = postData.content;
      if (postData.featuredImage) dbData.featured_image = postData.featuredImage;
      if (postData.category) dbData.category = postData.category;
      if (postData.tags) dbData.tags = postData.tags;
      if (postData.author) dbData.author = postData.author;
      if (postData.publishedDate) dbData.published_date = postData.publishedDate;
      if (postData.reactions) dbData.reactions = postData.reactions;

      const { error } = await supabase
        .from("posts")
        .update(dbData)
        .eq("id", postId);

      if (error) {
        throw error;
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, ...postData } : post
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Failed to update post");
      throw error;
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) {
        throw error;
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
      throw error;
    }
  };

  const getPostBySlug = (slug: string) => {
    return posts.find((post) => post.slug === slug);
  };

  const addComment = async (postId: string, comment: Omit<Comment, "id" | "date">) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          name: comment.name,
          content: comment.content
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newComment: Comment = {
          id: data.id,
          name: data.name,
          content: data.content,
          date: data.date
        };
        
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, comments: [newComment, ...post.comments] }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      throw error;
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) {
        throw error;
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                )
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
      throw error;
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        loading,
        addPost,
        updatePost,
        deletePost,
        getPostBySlug,
        addComment,
        deleteComment,
        fetchPosts
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
