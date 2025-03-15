
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
        const { data, error } = await supabase
          .from("posts")
          .select("*");
        
        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }
        
        // Transform the Supabase post data to match our BlogPost structure
        const blogPosts: BlogPost[] = data.map((post) => ({
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
          reactions: {
            like: 0,
            love: 0,
            clap: 0
          }
        }));
        
        setPosts(blogPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const addPost = async (post: Omit<BlogPost, "id" | "comments" | "reactions">) => {
    try {
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
          published_date: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error adding post:", error);
        return;
      }
      
      // Create a new post object with the structure needed for our application
      const newPost: BlogPost = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featured_image,
        category: data.category,
        tags: data.tags || [],
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
