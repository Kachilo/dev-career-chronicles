
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

// Make sure JsonPollOption has a string index to fix the type error
export interface JsonPollOption {
  id: string;
  text: string;
  votes: number;
  [key: string]: Json | undefined;
}
