import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { BlogPost, Comment } from "../types/blog";
import { supabase } from "../integrations/supabase/client";

interface BlogContextProps {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, "id" | "comments" | "reactions">) => void;
  updatePost: (postId: string, postData: Partial<BlogPost>) => void;
  deletePost: (postId: string) => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  addComment: (postId: string, comment: Omit<Comment, "id" | "date">) => void;
  deleteComment: (postId: string, commentId: string) => void;
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

  // Load posts from Supabase on initial load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching posts from Supabase...");
        const { data, error } = await supabase
          .from("posts")
          .select("*");
        
        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }
        
        console.log("Posts fetched successfully:", data);
        
        // Transform the Supabase post data to match our BlogPost structure
        const blogPosts: BlogPost[] = data.map((post) => {
          // Parse reactions from JSONB if it exists, or create default
          let reactions = {
            like: 0,
            love: 0,
            clap: 0
          };
          
          if (post.reactions) {
            try {
              // If it's already a JS object, use it directly
              if (typeof post.reactions === 'object') {
                reactions = {
                  like: post.reactions.like || 0,
                  love: post.reactions.love || 0,
                  clap: post.reactions.clap || 0
                };
              } 
              // Otherwise try to parse it from JSON string
              else if (typeof post.reactions === 'string') {
                const parsed = JSON.parse(post.reactions);
                reactions = {
                  like: parsed.like || 0,
                  love: parsed.love || 0,
                  clap: parsed.clap || 0
                };
              }
            } catch (e) {
              console.error("Error parsing reactions:", e);
            }
          }
          
          return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            featuredImage: post.featured_image,
            category: post.category,
            tags: post.tags || [],
            author: post.author,
            publishedDate: post.published_date,
            comments: [],
            reactions: reactions
          };
        });
        
        setPosts(blogPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const addPost = async (post: Omit<BlogPost, "id" | "comments" | "reactions">) => {
    try {
      console.log("Adding post to Supabase:", post);
      
      // Insert post into Supabase
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
          published_date: new Date().toISOString(),
          reactions: {
            like: 0,
            love: 0,
            clap: 0
          }
        })
        .select();
      
      if (error) {
        console.error("Error adding post:", error);
        return;
      }
      
      if (!data || data.length === 0) {
        console.error("No data returned after insert");
        return;
      }
      
      console.log("Post added successfully:", data[0]);
      
      // Create a new post object with the structure needed for our application
      const newPost: BlogPost = {
        id: data[0].id,
        title: data[0].title,
        slug: data[0].slug,
        excerpt: data[0].excerpt,
        content: data[0].content,
        featuredImage: data[0].featured_image,
        category: data[0].category,
        tags: data[0].tags || [],
        author: data[0].author,
        publishedDate: data[0].published_date,
        comments: [],
        reactions: {
          like: 0,
          love: 0,
          clap: 0
        }
      };
      
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } catch (error) {
      console.error("Failed to add post:", error);
    }
  };

  const updatePost = async (postId: string, postData: Partial<BlogPost>) => {
    try {
      // Prepare data for Supabase update
      const supabaseData: any = {};
      
      if (postData.title) supabaseData.title = postData.title;
      if (postData.slug) supabaseData.slug = postData.slug;
      if (postData.excerpt) supabaseData.excerpt = postData.excerpt;
      if (postData.content) supabaseData.content = postData.content;
      if (postData.featuredImage) supabaseData.featured_image = postData.featuredImage;
      if (postData.category) supabaseData.category = postData.category;
      if (postData.tags) supabaseData.tags = postData.tags;
      if (postData.author) supabaseData.author = postData.author;
      if (postData.reactions) supabaseData.reactions = postData.reactions;
      
      // Update post in Supabase
      const { error } = await supabase
        .from("posts")
        .update(supabaseData)
        .eq("id", postId);
      
      if (error) {
        console.error("Error updating post:", error);
        return;
      }
      
      // Update post in local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, ...postData } : post
        )
      );
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      // Delete post from Supabase
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);
      
      if (error) {
        console.error("Error deleting post:", error);
        return;
      }
      
      // Remove post from local state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const getPostBySlug = (slug: string) => {
    return posts.find((post) => post.slug === slug);
  };

  const addComment = async (postId: string, comment: Omit<Comment, "id" | "date">) => {
    const newComment: Comment = {
      ...comment,
      id: uuidv4(),
      date: new Date().toISOString()
    };
    
    try {
      // Add comment to Supabase
      const { error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          name: comment.name,
          content: comment.content,
          date: newComment.date
        });
      
      if (error) {
        console.error("Error adding comment:", error);
        return;
      }
      
      // Update posts in local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [newComment, ...post.comments] }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const deleteComment = async (postId: string, commentId: string) => {
    try {
      // Delete comment from Supabase
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
      
      if (error) {
        console.error("Error deleting comment:", error);
        return;
      }
      
      // Update posts in local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter((comment) => comment.id !== commentId)
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        addPost,
        updatePost,
        deletePost,
        getPostBySlug,
        addComment,
        deleteComment
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
