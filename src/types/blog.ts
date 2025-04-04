
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedDate: string;
  comments: Comment[];
  reactions: Reactions;
  views: number;
}

export interface Comment {
  id: string;
  name: string;
  content: string;
  date: string;
  replies?: Reply[];
  likes: number;
  dislikes: number;
}

export interface Reply {
  id: string;
  name: string;
  content: string;
  date: string;
}

export interface Reactions {
  like: number;
  love: number;
  clap: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  endDate: string;
  postId?: string;
  reference?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface AffiliateLink {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  category: string;
}

export interface Message {
  id: string;
  name: string;
  phone_number: string;
  message: string;
  is_read: boolean;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

// Types for JSON serialization with Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Make JsonPodcastTimestamp compatible with the database structure
export interface JsonPodcastTimestamp {
  time: string;
  label: string;
  [key: string]: Json | undefined;
}

// Updated podcast interfaces to be fully compatible with Supabase
export interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  episodeNumber: number;
  duration: string;
  uploadDate: string;
  thumbnailUrl?: string;
  guestNames?: string[];
  timestamps?: JsonPodcastTimestamp[]; // Using JsonPodcastTimestamp instead of PodcastTimestamp
  category: string;
  views: number;
  comments: PodcastComment[];
}

// This interface is now deprecated, use JsonPodcastTimestamp instead
export interface PodcastTimestamp {
  time: string;
  label: string;
}

export interface PodcastComment {
  id: string;
  podcastId: string;
  name: string;
  content: string;
  date: string;
  likes: number;
  dislikes: number;
}

// Make sure JsonPollOption has a string index to fix the type error
export interface JsonPollOption {
  id: string;
  text: string;
  votes: number;
  [key: string]: Json | undefined;
}
