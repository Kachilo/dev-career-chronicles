
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlogCard } from "../components/BlogCard";
import { CategoryList } from "../components/CategoryList";
import { useBlog } from "../context/BlogContext";
import { categories } from "../data/blogData";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts } = useBlog();
  const [postsToShow, setPostsToShow] = useState(6);
  const navigate = useNavigate();
  
  const category = categories.find(c => c.slug === slug);
  
  useEffect(() => {
    if (!category && slug) {
      navigate("/not-found");
    }
    
    // Reset posts to show when changing categories
    setPostsToShow(6);
    
    // Scroll to top on category change
    window.scrollTo(0, 0);
  }, [category, slug, navigate]);
  
  // Filter posts by category and sort by date (newest first)
  const filteredPosts = [...posts]
    .filter(post => post.category === slug)
    .sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
  
  const displayedPosts = filteredPosts.slice(0, postsToShow);
  
  const loadMore = () => {
    setPostsToShow(prev => prev + 6);
  };
  
  if (!category) {
    return null;
  }

  return (
    <div className="container py-8 space-y-12">
      <section>
        <h1 className="text-3xl md:text-4xl font-bold mb-6">
          {category.name} Articles
        </h1>
        
        <CategoryList categories={categories} activeCategorySlug={slug} />
        
        {displayedPosts.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            
            {postsToShow < filteredPosts.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found in this category</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
