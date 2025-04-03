import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { BlogPost, Comment, Poll, AffiliateLink, Message, Json, JsonPollOption, PodcastEpisode, PodcastComment, PodcastTimestamp } from "../types/blog";
import { supabase } from "../integrations/supabase/client";

interface BlogContextProps {
  posts: BlogPost[];
  polls: Poll[];
  affiliateLinks: AffiliateLink[];
  messages: Message[];
  podcasts: PodcastEpisode[];
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
  updatePoll: (pollId: string, pollData: Omit<Poll, "id">) => void;
  deletePoll: (pollId: string) => void;
  votePoll: (pollId: string, optionId: string) => void;
  addMessage: (message: Omit<Message, "id" | "created_at" | "updated_at" | "is_read" | "admin_reply">) => Promise<void>;
  markMessageAsRead: (messageId: string) => Promise<void>;
  replyToMessage: (messageId: string, reply: string) => Promise<void>;
  
  addPodcast: (podcast: Omit<PodcastEpisode, "id" | "comments" | "views" | "uploadDate">) => Promise<void>;
  updatePodcast: (podcastId: string, podcastData: Partial<PodcastEpisode>) => Promise<void>;
  deletePodcast: (podcastId: string) => Promise<void>;
  addPodcastComment: (podcastId: string, comment: Omit<PodcastComment, "id" | "date" | "likes" | "dislikes" | "podcastId">) => Promise<void>;
  likePodcastComment: (podcastId: string, commentId: string) => Promise<void>;
  dislikePodcastComment: (podcastId: string, commentId: string) => Promise<void>;
  incrementPodcastViews: (podcastId: string) => Promise<void>;
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
  const [polls, setPolls] = useState<Poll[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>([]);

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
        
        const blogPosts: BlogPost[] = data.map((post) => {
          let reactions = {
            like: 0,
            love: 0,
            clap: 0
          };
          
          if (post.reactions) {
            try {
              if (typeof post.reactions === 'object') {
                const reactionsObj = post.reactions as Record<string, any>;
                reactions = {
                  like: reactionsObj.like || 0,
                  love: reactionsObj.love || 0,
                  clap: reactionsObj.clap || 0
                };
              } 
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
            views: post.views || Math.floor(Math.random() * 200)
          };
        });
        
        setPosts(blogPosts);
        
        blogPosts.forEach(post => {
          fetchCommentsForPost(post.id);
        });
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    const fetchPolls = async () => {
      try {
        console.log("Fetching polls from Supabase...");
        const { data, error } = await supabase
          .from("polls")
          .select("*");
        
        if (error) {
          console.error("Error fetching polls:", error);
          return;
        }
        
        console.log("Polls fetched successfully:", data);
        
        if (data) {
          const formattedPolls: Poll[] = data.map(poll => {
            let pollOptions = [];
            
            if (poll.options) {
              try {
                if (typeof poll.options === 'string') {
                  pollOptions = JSON.parse(poll.options);
                } else {
                  pollOptions = (poll.options as any[]).map(opt => ({
                    id: opt.id,
                    text: opt.text,
                    votes: opt.votes
                  }));
                }
              } catch (e) {
                console.error("Error parsing poll options:", e);
              }
            }
            
            return {
              id: poll.id,
              question: poll.question,
              options: pollOptions,
              endDate: poll.end_date,
              postId: poll.post_id || undefined,
              reference: poll.reference || "OMAR WASHE KONDE"
            };
          });
          
          setPolls(formattedPolls);
        }
      } catch (error) {
        console.error("Failed to fetch polls:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        console.log("Fetching messages from Supabase...");
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }
        
        console.log("Messages fetched successfully:", data);
        
        if (data) {
          setMessages(data as Message[]);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    const fetchPodcasts = async () => {
      try {
        console.log("Fetching podcasts from Supabase...");
        const { data, error } = await supabase
          .from("podcasts")
          .select("*")
          .order("upload_date", { ascending: false });
        
        if (error) {
          console.error("Error fetching podcasts:", error);
          return;
        }
        
        console.log("Podcasts fetched successfully:", data);
        
        if (data) {
          const formattedPodcasts: PodcastEpisode[] = await Promise.all(data.map(async (podcast) => {
            const { data: commentsData, error: commentsError } = await supabase
              .from("podcast_comments")
              .select("*")
              .eq("podcast_id", podcast.id)
              .order("date", { ascending: false });
            
            if (commentsError) {
              console.error(`Error fetching comments for podcast ${podcast.id}:`, commentsError);
            }
            
            const comments: PodcastComment[] = commentsData ? commentsData.map(comment => ({
              id: comment.id,
              podcastId: comment.podcast_id,
              name: comment.name,
              content: comment.content,
              date: comment.date,
              likes: comment.likes || 0,
              dislikes: comment.dislikes || 0
            })) : [];
            
            let formattedTimestamps: PodcastTimestamp[] = [];
            if (podcast.timestamps) {
              try {
                if (typeof podcast.timestamps === 'string') {
                  formattedTimestamps = JSON.parse(podcast.timestamps);
                } else {
                  formattedTimestamps = podcast.timestamps as unknown as PodcastTimestamp[];
                }
              } catch (e) {
                console.error("Error parsing podcast timestamps:", e);
              }
            }

            return {
              id: podcast.id,
              title: podcast.title,
              description: podcast.description,
              audioUrl: podcast.audio_url,
              episodeNumber: podcast.episode_number,
              duration: podcast.duration,
              uploadDate: podcast.upload_date,
              thumbnailUrl: podcast.thumbnail_url,
              guestNames: podcast.guest_names || [],
              timestamps: formattedTimestamps,
              category: podcast.category,
              views: podcast.views,
              comments: comments
            };
          }));
          
          setPodcasts(formattedPodcasts);
        }
      } catch (error) {
        console.error("Failed to fetch podcasts:", error);
      }
    };

    fetchPosts();
    fetchPolls();
    fetchMessages();
    fetchPodcasts();
  }, []);

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
      
      const { error } = await supabase
        .from("posts")
        .update(supabaseData)
        .eq("id", postId);
      
      if (error) {
        console.error("Error updating post:", error);
        return;
      }
      
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
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);
      
      if (error) {
        console.error("Error deleting post:", error);
        return;
      }
      
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
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);
      
      if (error) {
        console.error("Error deleting comment:", error);
        return;
      }
      
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
      const post = posts.find(p => p.id === postId);
      const comment = post?.comments.find(c => c.id === commentId);
      
      if (!comment) return;
      
      const { error } = await supabase
        .from("comments")
        .update({ likes: comment.likes + 1 })
        .eq("id", commentId);
      
      if (error) {
        console.error("Error liking comment:", error);
        return;
      }
      
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
      
      console.log("Comment liked successfully, new count:", comment.likes + 1);
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };
  
  const dislikeComment = async (postId: string, commentId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      const comment = post?.comments.find(c => c.id === commentId);
      
      if (!comment) return;
      
      const { error } = await supabase
        .from("comments")
        .update({ dislikes: comment.dislikes + 1 })
        .eq("id", commentId);
      
      if (error) {
        console.error("Error disliking comment:", error);
        return;
      }
      
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
      
      console.log("Comment disliked successfully, new count:", comment.dislikes + 1);
    } catch (error) {
      console.error("Failed to dislike comment:", error);
    }
  };
  
  const incrementViews = async (postId: string) => {
    try {
      const post = posts.find(p => p.id === postId);
      
      if (!post) return;
      
      const newViewCount = (post.views || 0) + 1;
      
      const { error } = await supabase
        .from("posts")
        .update({ views: newViewCount })
        .eq("id", postId);
      
      if (error) {
        console.error("Error incrementing views:", error);
        return;
      }
      
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

  const addPoll = async (poll: Omit<Poll, "id">) => {
    try {
      const newPoll: Poll = {
        ...poll,
        id: uuidv4()
      };
      
      try {
        const jsonOptions: JsonPollOption[] = newPoll.options.map(opt => ({
          id: opt.id,
          text: opt.text,
          votes: opt.votes
        }));
        
        const { data, error } = await supabase
          .from("polls")
          .insert({
            question: newPoll.question,
            options: jsonOptions as unknown as Json,
            end_date: newPoll.endDate,
            post_id: newPoll.postId,
            reference: newPoll.reference || "OMAR WASHE KONDE"
          })
          .select();
        
        if (error) {
          console.error("Error storing poll in Supabase:", error);
        } else if (data && data.length > 0) {
          console.log("Poll stored in Supabase:", data[0]);
          newPoll.id = data[0].id;
        }
      } catch (e) {
        console.error("Supabase poll storage failed:", e);
      }
      
      setPolls((prevPolls) => [...prevPolls, newPoll]);
      console.log("New poll added:", newPoll);
    } catch (error) {
      console.error("Failed to add poll:", error);
    }
  };
  
  const updatePoll = async (pollId: string, pollData: Omit<Poll, "id">) => {
    try {
      const updatedPolls = polls.map(poll => 
        poll.id === pollId 
          ? { ...pollData, id: pollId } 
          : poll
      );
      
      setPolls(updatedPolls);
      
      const updatedPoll = updatedPolls.find(p => p.id === pollId);
      
      if (updatedPoll) {
        try {
          const jsonOptions: JsonPollOption[] = updatedPoll.options.map(opt => ({
            id: opt.id,
            text: opt.text,
            votes: opt.votes
          }));
          
          const { error } = await supabase
            .from("polls")
            .update({ 
              question: updatedPoll.question,
              options: jsonOptions as unknown as Json,
              end_date: updatedPoll.endDate,
              post_id: updatedPoll.postId,
              reference: updatedPoll.reference
            })
            .eq("id", pollId);
          
          if (error) {
            console.error("Error updating poll in Supabase:", error);
          }
        } catch (e) {
          console.error("Supabase poll update failed:", e);
        }
      }
    } catch (error) {
      console.error("Failed to update poll:", error);
    }
  };
  
  const deletePoll = async (pollId: string) => {
    try {
      setPolls(prevPolls => prevPolls.filter(poll => poll.id !== pollId));
      
      const { error } = await supabase
        .from("polls")
        .delete()
        .eq("id", pollId);
      
      if (error) {
        console.error("Error deleting poll from Supabase:", error);
      }
    } catch (error) {
      console.error("Failed to delete poll:", error);
    }
  };
  
  const votePoll = async (pollId: string, optionId: string) => {
    try {
      const updatedPolls = polls.map((poll) =>
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
      );
      
      setPolls(updatedPolls);
      
      const updatedPoll = updatedPolls.find(p => p.id === pollId);
      
      if (updatedPoll) {
        try {
          const jsonOptions: JsonPollOption[] = updatedPoll.options.map(opt => ({
            id: opt.id,
            text: opt.text,
            votes: opt.votes
          }));
          
          const { error } = await supabase
            .from("polls")
            .update({ options: jsonOptions as Json })
            .eq("id", pollId);
          
          if (error) {
            console.error("Error updating poll votes in Supabase:", error);
          }
        } catch (e) {
          console.error("Supabase poll vote update failed:", e);
        }
      }
    } catch (error) {
      console.error("Failed to vote on poll:", error);
    }
  };

  const addMessage = async (message: Omit<Message, "id" | "created_at" | "updated_at" | "is_read" | "admin_reply">) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          name: message.name,
          phone_number: message.phone_number,
          message: message.message,
          is_read: false
        })
        .select();
      
      if (error) {
        console.error("Error adding message:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        const newMessage = data[0] as Message;
        setMessages(prevMessages => [newMessage, ...prevMessages]);
        console.log("Message added successfully:", newMessage);
      }
    } catch (error) {
      console.error("Failed to add message:", error);
      throw error;
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("id", messageId);
      
      if (error) {
        console.error("Error marking message as read:", error);
        throw error;
      }
      
      setMessages(prevMessages => 
        prevMessages.map(message => 
          message.id === messageId 
            ? { ...message, is_read: true } 
            : message
        )
      );
    } catch (error) {
      console.error("Failed to mark message as read:", error);
      throw error;
    }
  };

  const replyToMessage = async (messageId: string, reply: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ 
          admin_reply: reply,
          is_read: true 
        })
        .eq("id", messageId);
      
      if (error) {
        console.error("Error replying to message:", error);
        throw error;
      }
      
      setMessages(prevMessages => 
        prevMessages.map(message => 
          message.id === messageId 
            ? { ...message, admin_reply: reply, is_read: true } 
            : message
        )
      );
    } catch (error) {
      console.error("Failed to reply to message:", error);
      throw error;
    }
  };

  const addPodcast = async (podcast: Omit<PodcastEpisode, "id" | "comments" | "views" | "uploadDate">) => {
    try {
      console.log("Adding podcast to Supabase:", podcast);
      
      let formattedTimestamps = null;
      if (podcast.timestamps && podcast.timestamps.length > 0) {
        formattedTimestamps = podcast.timestamps;
      }
      
      const { data, error } = await supabase
        .from("podcasts")
        .insert({
          title: podcast.title,
          description: podcast.description,
          audio_url: podcast.audioUrl,
          episode_number: podcast.episodeNumber,
          duration: podcast.duration,
          thumbnail_url: podcast.thumbnailUrl,
          guest_names: podcast.guestNames || [],
          timestamps: formattedTimestamps as PodcastTimestamp[],
          category: podcast.category,
          views: 0
        })
        .select();
      
      if (error) {
        console.error("Error adding podcast:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.error("No data returned after insert");
        throw new Error("Failed to add podcast");
      }
      
      console.log("Podcast added successfully:", data[0]);
      
      const newPodcast: PodcastEpisode = {
        id: data[0].id,
        title: data[0].title,
        description: data[0].description,
        audioUrl: data[0].audio_url,
        episodeNumber: data[0].episode_number,
        duration: data[0].duration,
        uploadDate: data[0].upload_date,
        thumbnailUrl: data[0].thumbnail_url,
        guestNames: data[0].guest_names || [],
        timestamps: data[0].timestamps || [],
        category: data[0].category,
        views: 0,
        comments: []
      };
      
      setPodcasts((prevPodcasts) => [newPodcast, ...prevPodcasts]);
    } catch (error) {
      console.error("Failed to add podcast:", error);
      throw error;
    }
  };

  const updatePodcast = async (podcastId: string, podcastData: Partial<PodcastEpisode>) => {
    try {
      const supabaseData: any = {};
      
      if (podcastData.title) supabaseData.title = podcastData.title;
      if (podcastData.description) supabaseData.description = podcastData.description;
      if (podcastData.audioUrl) supabaseData.audio_url = podcastData.audioUrl;
      if (podcastData.episodeNumber) supabaseData.episode_number = podcastData.episodeNumber;
      if (podcastData.duration) supabaseData.duration = podcastData.duration;
      if (podcastData.thumbnailUrl) supabaseData.thumbnail_url = podcastData.thumbnailUrl;
      if (podcastData.guestNames) supabaseData.guest_names = podcastData.guestNames;
      if (podcastData.timestamps) supabaseData.timestamps = podcastData.timestamps;
      if (podcastData.category) supabaseData.category = podcastData.category;
      
      const { error } = await supabase
        .from("podcasts")
        .update(supabaseData)
        .eq("id", podcastId);
      
      if (error) {
        console.error("Error updating podcast:", error);
        throw error;
      }
      
      setPodcasts((prevPodcasts) =>
        prevPodcasts.map((podcast) =>
          podcast.id === podcastId ? { ...podcast, ...podcastData } : podcast
        )
      );
    } catch (error) {
      console.error("Failed to update podcast:", error);
      throw error;
    }
  };

  const deletePodcast = async (podcastId: string) => {
    try {
      const { error } = await supabase
        .from("podcasts")
        .delete()
        .eq("id", podcastId);
      
      if (error) {
        console.error("Error deleting podcast:", error);
        throw error;
      }
      
      setPodcasts((prevPodcasts) => prevPodcasts.filter((podcast) => podcast.id !== podcastId));
    } catch (error) {
      console.error("Failed to delete podcast:", error);
      throw error;
    }
  };

  const addPodcastComment = async (podcastId: string, comment: Omit<PodcastComment, "id" | "date" | "likes" | "dislikes" | "podcastId">) => {
    try {
      const { data, error } = await supabase
        .from("podcast_comments")
        .insert({
          podcast_id: podcastId,
          name: comment.name,
          content: comment.content,
          date: new Date().toISOString(),
          likes: 0,
          dislikes: 0
        })
        .select();
      
      if (error) {
        console.error("Error adding podcast comment:", error);
        throw error;
      }
      
      console.log("Podcast comment added successfully:", data);
      
      if (data && data.length > 0) {
        const newComment: PodcastComment = {
          id: data[0].id,
          podcastId: data[0].podcast_id,
          name: data[0].name,
          content: data[0].content,
          date: data[0].date,
          likes: 0,
          dislikes: 0
        };
        
        setPodcasts((prevPodcasts) =>
          prevPodcasts.map((podcast) =>
            podcast.id === podcastId
              ? { ...podcast, comments: [newComment, ...podcast.comments] }
              : podcast
          )
        );
      }
    } catch (error) {
      console.error("Failed to add podcast comment:", error);
      throw error;
    }
  };

  const likePodcastComment = async (podcastId: string, commentId: string) => {
    try {
      const podcast = podcasts.find(p => p.id === podcastId);
      const comment = podcast?.comments.find(c => c.id === commentId);
      
      if (!comment) return;
      
      const { error } = await supabase
        .from("podcast_comments")
        .update({ likes: comment.likes + 1 })
        .eq("id", commentId);
      
      if (error) {
        console.error("Error liking podcast comment:", error);
        throw error;
      }
      
      setPodcasts((prevPodcasts) =>
        prevPodcasts.map((podcast) =>
          podcast.id === podcastId
            ? {
                ...podcast,
                comments: podcast.comments.map((c) =>
                  c.id === commentId
                    ? { ...c, likes: c.likes + 1 }
                    : c
                )
              }
            : podcast
        )
      );
    } catch (error) {
      console.error("Failed to like podcast comment:", error);
      throw error;
    }
  };

  const dislikePodcastComment = async (podcastId: string, commentId: string) => {
    try {
      const podcast = podcasts.find(p => p.id === podcastId);
      const comment = podcast?.comments.find(c => c.id === commentId);
      
      if (!comment) return;
      
      const { error } = await supabase
        .from("podcast_comments")
        .update({ dislikes: comment.dislikes + 1 })
        .eq("id", commentId);
      
      if (error) {
        console.error("Error disliking podcast comment:", error);
        throw error;
      }
      
      setPodcasts((prevPodcasts) =>
        prevPodcasts.map((podcast) =>
          podcast.id === podcastId
            ? {
                ...podcast,
                comments: podcast.comments.map((c) =>
                  c.id === commentId
                    ? { ...c, dislikes: c.dislikes + 1 }
                    : c
                )
              }
            : podcast
        )
      );
    } catch (error) {
      console.error("Failed to dislike podcast comment:", error);
      throw error;
    }
  };

  const incrementPodcastViews = async (podcastId: string) => {
    try {
      const podcast = podcasts.find(p => p.id === podcastId);
      
      if (!podcast) return;
      
      const newViewCount = (podcast.views || 0) + 1;
      
      const { error } = await supabase
        .from("podcasts")
        .update({ views: newViewCount })
        .eq("id", podcastId);
      
      if (error) {
        console.error("Error incrementing podcast views:", error);
        throw error;
      }
      
      setPodcasts((prevPodcasts) =>
        prevPodcasts.map((p) =>
          p.id === podcastId
            ? { ...p, views: newViewCount }
            : p
        )
      );
    } catch (error) {
      console.error("Failed to increment podcast views:", error);
      throw error;
    }
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        polls,
        affiliateLinks,
        messages,
        podcasts,
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
        updatePoll,
        deletePoll,
        votePoll,
        addMessage,
        markMessageAsRead,
        replyToMessage,
        addPodcast,
        updatePodcast,
        deletePodcast,
        addPodcastComment,
        likePodcastComment,
        dislikePodcastComment,
        incrementPodcastViews
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
