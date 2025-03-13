
import { BlogPost } from "../types/blog";
import { BlogCard } from "./BlogCard";

interface RelatedPostsProps {
  currentPostId: string;
  posts: BlogPost[];
}

export const RelatedPosts = ({ currentPostId, posts }: RelatedPostsProps) => {
  // Filter out current post and get up to 3 related posts
  const relatedPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
