
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
}

export interface Comment {
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
