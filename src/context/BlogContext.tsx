
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { BlogPost, Comment } from "../types/blog";
import { blogPosts as initialBlogPosts } from "../data/blogData";

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

  // Initialize posts from local storage or initial data
  useEffect(() => {
    const savedPosts = localStorage.getItem("blog-posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(initialBlogPosts);
    }
  }, []);

  // Save posts to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("blog-posts", JSON.stringify(posts));
  }, [posts]);

  const addPost = (post: Omit<BlogPost, "id" | "comments" | "reactions">) => {
    const newPost: BlogPost = {
      ...post,
      id: uuidv4(),
      comments: [],
      reactions: {
        like: 0,
        love: 0,
        clap: 0
      }
    };
    
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const updatePost = (postId: string, postData: Partial<BlogPost>) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, ...postData } : post
      )
    );
  };

  const deletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
  };

  const getPostBySlug = (slug: string) => {
    return posts.find((post) => post.slug === slug);
  };

  const addComment = (postId: string, comment: Omit<Comment, "id" | "date">) => {
    const newComment: Comment = {
      ...comment,
      id: uuidv4(),
      date: new Date().toISOString()
    };
    
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [newComment, ...post.comments] }
          : post
      )
    );
  };

  const deleteComment = (postId: string, commentId: string) => {
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
