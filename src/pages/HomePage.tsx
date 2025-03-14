
import { CategoryList } from "../components/CategoryList";
import { BlogCard } from "../components/BlogCard";
import { useBlog } from "../context/BlogContext";
import { categories } from "../data/blogData";
import { useState } from "react";

const HomePage = () => {
  const { posts } = useBlog();
  const [postsToShow, setPostsToShow] = useState(6);
  
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
  
  const loadMore = () => {
    setPostsToShow(prev => prev + 6);
  };

  return (
    <div className="container py-8 space-y-12">
      {/* Hero Banner */}
      <section className="banner-gradient text-white rounded-lg p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Insights on Freelancing, Web Development, and Career Growth
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6">
            Practical advice to help you succeed in the digital world
          </p>
        </div>
      </section>
      
      {/* All Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">All Articles</h2>
        </div>
        
        <CategoryList categories={categories} />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedPosts.slice(0, postsToShow).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        
        {postsToShow < sortedPosts.length && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Load More
            </button>
          </div>
        )}
        
        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
