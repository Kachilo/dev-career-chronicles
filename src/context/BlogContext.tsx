import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { BlogPost, Comment, Poll, AffiliateLink } from "../types/blog";
import { supabase } from "../integrations/supabase/client";

interface BlogContextProps {
  posts: BlogPost[];
  polls: Poll[];
  affiliateLinks: AffiliateLink[];
  addPost: (post: Omit<BlogPost, "id" | "comments" | "reactions" | "views">) => void;
  updatePost: (postId: string, postData: Partial<BlogPost>) => void;
  deletePost: (postId: string) => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  addComment: (postId: string, comment: Omit<Comment, "id" | "date" | "likes" | "dislikes">) => void;
  deleteComment: (postId: string, commentId: string) => void;
  likeComment: (postId: string, commentId: string) => void;
  dislikeComment: (postId: string, commentId: string) => void;
  incrementViews: (postId: string) => void;
  addPoll: (poll: Omit<Poll, "id">) => void;
  votePoll: (pollId: string, optionId: string) => void;
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
  const [polls, setPolls] = useState<Poll[]>([]);
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
    {
      id: "1",
      title: "The Complete Web Development Course",
      description: "Learn web development from scratch with this comprehensive course.",
      imageUrl: "https://picsum.photos/seed/webdev/300/200",
      linkUrl: "https://example.com/affiliate/webdev",
      category: "web-development"
    },
    {
      id: "2",
      title: "Premium Web Hosting",
      description: "Fast and reliable hosting for your websites.",
      imageUrl: "https://picsum.photos/seed/hosting/300/200",
      linkUrl: "https://example.com/affiliate/hosting",
      category: "web-development"
    },
    {
      id: "3",
      title: "Freelancing Masterclass",
      description: "Learn how to build a successful freelancing career.",
      imageUrl: "https://picsum.photos/seed/freelance/300/200",
      linkUrl: "https://example.com/affiliate/freelance",
      category: "freelancing"
    },
    {
      id: "4",
      title: "Digital Marketing Toolkit",
      description: "Essential tools for digital marketing success.",
      imageUrl: "https://picsum.photos/seed/marketing/300/200",
      linkUrl: "https://example.com/affiliate/marketing",
      category: "digital-marketing"
    }
  ]);

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
                const reactionsObj = post.reactions as Record<string, any>;
                reactions = {
                  like: reactionsObj.like || 0,
                  love: reactionsObj.love || 0,
                  clap: reactionsObj.clap || 0
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
            reactions: reactions,
            views: post.views || Math.floor(Math.random() * 200) // For demo purposes
          };
        });
        
        setPosts(blogPosts);
        
        // After loading posts, fetch comments for each post
        blogPosts.forEach(post => {
          fetchCommentsForPost(post.id);
        });
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);
  
  // Function to fetch comments for a specific post
  const fetchCommentsForPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("date", { ascending: false });
        
      if (error) {
        console.error(`Error fetching comments for post ${postId}:`, error);
        return;
      }
      
      console.log(`Comments fetched for post ${postId}:`, data);
      
      const comments: Comment[] = data.map(comment => ({
        id: comment.id,
        name: comment.name,
        content: comment.content,
        date: comment.date,
        likes: comment.likes || 0,
        dislikes: comment.dislikes || 0
      }));
      
      // Update post with comments
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, comments } 
            : post
        )
      );
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
    }
  };

  const addPost = async (post: Omit<BlogPost, "id" | "comments" | "reactions" | "views">) => {
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
          },
          views: 0
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
        },
        views: 0
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

  const addComment = async (postId: string, comment: Omit<Comment, "id" | "date" | "likes" | "dislikes">) => {
    const newComment: Comment = {
      ...comment,
      id: uuidv4(),
      date: new Date().toISOString(),
      likes: 0,
      dislikes: 0
    };
    
    try {
      // Add comment to Supabase
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          name: comment.name,
          content: comment.content,
          date: newComment.date,
          likes: 0,
          dislikes: 0
        })
        .select();
      
      if (error) {
        console.error("Error adding comment:", error);
        return;
      }
      
      console.log("Comment added successfully:", data);
      
      if (data && data.length > 0) {
        newComment.id = data[0].id;
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
  
  const likeComment = async (postId: string, commentId: string) => {
    try {
      // First, get the current comment 
      const post = posts.find(p => p.id === postId);
      const comment = post?.comments.find(c => c.id === commentId);
      
      if (!comment) return;
      
      // Update comment likes in Supabase
      const { error } = await supabase
        .from("comments")
        .update({ likes: comment.likes + 1 })
        .eq("id", commentId);
      
      if (error) {
        console.error("Error liking comment:", error);
        return;
      }
      
      // Update comment in local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((c) =>
                  c.id === commentId
                    ? { ...c, likes: c.likes + 1 }
                    : c
                )
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };
  
  const dislikeComment = async (postId: string, commentId: string) => {
    try {
      // First, get the current comment
      const post = posts.find(p => p.id === postId);
      const comment = post?.comments.find(c => c.id === commentId);
      
      if (!comment) return;
      
      // Update comment dislikes in Supabase
      const { error } = await supabase
        .from("comments")
        .update({ dislikes: comment.dislikes + 1 })
        .eq("id", commentId);
      
      if (error) {
        console.error("Error disliking comment:", error);
        return;
      }
      
      // Update comment in local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((c) =>
                  c.id === commentId
                    ? { ...c, dislikes: c.dislikes + 1 }
                    : c
                )
              }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to dislike comment:", error);
    }
  };
  
  const incrementViews = async (postId: string) => {
    try {
      // Get the current post
      const post = posts.find(p => p.id === postId);
      
      if (!post) return;
      
      const newViewCount = (post.views || 0) + 1;
      
      // Update views in Supabase
      const { error } = await supabase
        .from("posts")
        .update({ views: newViewCount })
        .eq("id", postId);
      
      if (error) {
        console.error("Error incrementing views:", error);
        return;
      }
      
      // Update post in local state
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.id === postId
            ? { ...p, views: newViewCount }
            : p
        )
      );
    } catch (error) {
      console.error("Failed to increment views:", error);
    }
  };
  
  // Poll functions
  const addPoll = (poll: Omit<Poll, "id">) => {
    const newPoll: Poll = {
      ...poll,
      id: uuidv4()
    };
    
    setPolls((prevPolls) => [...prevPolls, newPoll]);
  };
  
  const votePoll = (pollId: string, optionId: string) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((option) =>
                option.id === optionId
                  ? { ...option, votes: option.votes + 1 }
                  : option
              )
            }
          : poll
      )
    );
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        polls,
        affiliateLinks,
        addPost,
        updatePost,
        deletePost,
        getPostBySlug,
        addComment,
        deleteComment,
        likeComment,
        dislikeComment,
        incrementViews,
        addPoll,
        votePoll
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
