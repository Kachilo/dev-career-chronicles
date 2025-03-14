
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { BlogPost, Comment } from "../types/blog";
import { blogPosts as initialBlogPosts } from "../data/blogData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BlogContextProps {
  posts: BlogPost[];
  loading: boolean;
  addPost: (post: Omit<BlogPost, "id" | "comments" | "reactions">) => Promise<void>;
  updatePost: (postId: string, postData: Partial<BlogPost>) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  addComment: (postId: string, comment: Omit<Comment, "id" | "date">) => Promise<void>;
  deleteComment: (postId: string, commentId: string) => Promise<void>;
  addReaction: (postId: string, type: "like" | "love" | "clap") => Promise<void>;
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

// Helper function to generate a session ID for reactions
const getSessionId = () => {
  let sessionId = localStorage.getItem("blog-session-id");
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem("blog-session-id", sessionId);
  }
  return sessionId;
};

export const BlogProvider = ({ children }: BlogProviderProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch posts from Supabase on initial load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Fetch posts
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .order("published_date", { ascending: false });
        
        if (postsError) throw postsError;
        
        // Fetch all comments
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*");
        
        if (commentsError) throw commentsError;
        
        // Fetch all reactions
        const { data: reactionsData, error: reactionsError } = await supabase
          .from("reactions")
          .select("*");
        
        if (reactionsError) throw reactionsError;
        
        // Group comments by post_id
        const commentsByPostId = commentsData.reduce((acc: Record<string, Comment[]>, comment) => {
          if (!acc[comment.post_id]) {
            acc[comment.post_id] = [];
          }
          acc[comment.post_id].push({
            id: comment.id,
            name: comment.name,
            content: comment.content,
            date: comment.date
          });
          return acc;
        }, {});
        
        // Count reactions by post_id and type
        const reactionsByPostId = reactionsData.reduce((acc: Record<string, { like: number; love: number; clap: number }>, reaction) => {
          if (!acc[reaction.post_id]) {
            acc[reaction.post_id] = { like: 0, love: 0, clap: 0 };
          }
          acc[reaction.post_id][reaction.type]++;
          return acc;
        }, {});
        
        // Transform posts data to match our BlogPost interface
        const transformedPosts: BlogPost[] = postsData.map((post) => ({
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
          comments: commentsByPostId[post.id] || [],
          reactions: reactionsByPostId[post.id] || { like: 0, love: 0, clap: 0 }
        }));
        
        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error fetching blog data:", error);
        toast({
          title: "Error loading blog posts",
          description: "Failed to load blog posts from the database. Using cached data instead.",
          variant: "destructive"
        });
        
        // Fallback to localStorage if available, then initial data
        const savedPosts = localStorage.getItem("blog-posts");
        if (savedPosts) {
          setPosts(JSON.parse(savedPosts));
        } else {
          setPosts(initialBlogPosts);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [toast]);

  // Add a new post
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
      
      if (error) throw error;
      
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
        reactions: {
          like: 0,
          love: 0,
          clap: 0
        }
      };
      
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("Error adding post:", error);
      toast({
        title: "Error",
        description: "Failed to add the post.",
        variant: "destructive"
      });
    }
  };

  // Update a post
  const updatePost = async (postId: string, postData: Partial<BlogPost>) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          featured_image: postData.featuredImage,
          category: postData.category,
          tags: postData.tags,
          author: postData.author,
          published_date: postData.publishedDate
        })
        .eq("id", postId);
      
      if (error) throw error;
      
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, ...postData } : post
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update the post.",
        variant: "destructive"
      });
    }
  };

  // Delete a post
  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);
      
      if (error) throw error;
      
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete the post.",
        variant: "destructive"
      });
    }
  };

  // Get a post by slug
  const getPostBySlug = (slug: string) => {
    return posts.find((post) => post.slug === slug);
  };

  // Add a comment to a post
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
      
      if (error) throw error;
      
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
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add the comment.",
        variant: "destructive"
      });
    }
  };

  // Delete a comment
  const deleteComment = async (postId: string, commentId: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
      
      if (error) throw error;
      
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
      toast({
        title: "Error",
        description: "Failed to delete the comment.",
        variant: "destructive"
      });
    }
  };

  // Add a reaction to a post
  const addReaction = async (postId: string, type: "like" | "love" | "clap") => {
    const sessionId = getSessionId();
    
    try {
      // Check if user already reacted with this type
      const { data: existingReaction, error: checkError } = await supabase
        .from("reactions")
        .select("id")
        .eq("post_id", postId)
        .eq("session_id", sessionId)
        .eq("type", type)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingReaction) {
        // Remove reaction if it exists
        const { error: deleteError } = await supabase
          .from("reactions")
          .delete()
          .eq("id", existingReaction.id);
        
        if (deleteError) throw deleteError;
        
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  reactions: {
                    ...post.reactions,
                    [type]: Math.max(0, post.reactions[type] - 1)
                  }
                }
              : post
          )
        );
      } else {
        // Add new reaction
        const { error: insertError } = await supabase
          .from("reactions")
          .insert({
            post_id: postId,
            type,
            session_id: sessionId
          });
        
        if (insertError) throw insertError;
        
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  reactions: {
                    ...post.reactions,
                    [type]: post.reactions[type] + 1
                  }
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast({
        title: "Error",
        description: "Failed to update reaction.",
        variant: "destructive"
      });
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
        addReaction
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
