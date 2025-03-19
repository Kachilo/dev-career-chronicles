
import { useState } from "react";
import { BlogCard } from "../components/BlogCard";
import { CategoryList } from "../components/CategoryList";
import { TrendingPosts } from "../components/TrendingPosts";
import { PollWidget } from "../components/PollWidget";
import { AffiliateProducts } from "../components/AffiliateProducts";
import DonationButton from "../components/DonationButton";
import { useBlog } from "../context/BlogContext";
import { categories } from "../data/blogData";
import { HeroSlider } from "@/components/HeroSlider";

const HomePage = () => {
  const { posts, polls, affiliateLinks, votePoll } = useBlog();
  const [postsToShow, setPostsToShow] = useState(6);
  
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
  
  // Get featured post (most recent)
  const featuredPost = sortedPosts[0];
  
  // Get recent posts (excluding featured)
  const recentPosts = sortedPosts.slice(1, postsToShow);
  
  // Get a sample poll
  const samplePoll = polls[0] || {
    id: "home-poll",
    question: "What content would you like to see more of?",
    options: [
      { id: "opt-1", text: "Tutorials", votes: 42 },
      { id: "opt-2", text: "Case Studies", votes: 28 },
      { id: "opt-3", text: "Industry News", votes: 35 },
      { id: "opt-4", text: "Personal Stories", votes: 16 }
    ],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  const loadMore = () => {
    setPostsToShow(prev => prev + 6);
  };

  return (
    <div className="container py-8 space-y-12">
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Featured Content Section */}
      <section className="py-12 bg-muted/30 rounded-lg px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Content</h2>
            <DonationButton />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Recent Posts */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">Recent Articles</h2>
            </div>
            
            <CategoryList categories={categories} />
            
            <div className="grid gap-6 md:grid-cols-2">
              {recentPosts.map((post) => (
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
            
            {recentPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found</p>
              </div>
            )}
          </section>
        </div>
        
        {/* Sidebar */}
        <aside className="space-y-6">
          <TrendingPosts posts={posts} />
          
          <PollWidget poll={samplePoll} onVote={votePoll} />
          
          <AffiliateProducts links={affiliateLinks.slice(0, 2)} />
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
