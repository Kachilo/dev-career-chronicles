
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BlogCard } from "../components/BlogCard";
import { CategoryList } from "../components/CategoryList";
import { TrendingPosts } from "../components/TrendingPosts";
import { PollWidget } from "../components/PollWidget";
import { AffiliateProducts } from "../components/AffiliateProducts";
import DonationButton from "../components/DonationButton";
import { useBlog } from "../context/BlogContext";
import { categories } from "../data/blogData";
import { HeroSlider } from "@/components/HeroSlider";
import { FeaturedContent } from "@/components/FeaturedContent";
import { Button } from "@/components/ui/button";
import { FileText, Headphones, BarChart3 } from "lucide-react";

const HomePage = () => {
  const { posts, polls, affiliateLinks, votePoll } = useBlog();
  const [postsToShow, setPostsToShow] = useState(6);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  
  // Preload images for better performance
  useEffect(() => {
    const imagesToPreload = posts.slice(0, postsToShow).map(post => post.featuredImage);
    let loadedCount = 0;
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesToPreload.length) {
          setImagesPreloaded(true);
        }
      };
    });
    
    // Set preloaded to true after a timeout in case images are cached
    const timeout = setTimeout(() => {
      setImagesPreloaded(true);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [posts, postsToShow]);
  
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
    <div className="space-y-12">
      {/* Hero Slider - Full screen with CTAs */}
      <div className="relative min-h-[80vh] flex items-center justify-center bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <HeroSlider />
        </div>
        <div className="relative z-10 container mx-auto text-center px-4 py-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Welcome to OMAR WASHE KONDE
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto drop-shadow-md">
            Insights, ideas, and inspiration for your personal and professional growth
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/categories/web-development" className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Explore Blogs
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="secondary">
              <Link to="/podcast" className="flex items-center">
                <Headphones className="mr-2 h-5 w-5" />
                Listen to Podcasts
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="bg-background/80 hover:bg-background/90">
              <a href="#polls" className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Join the Polls
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container py-8">
        {/* Featured Content Section */}
        <FeaturedContent />
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2">
            {/* Recent Posts */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Recent Articles</h2>
                <Button asChild variant="outline" size="sm">
                  <Link to="/categories/all">View All</Link>
                </Button>
              </div>
              
              <CategoryList categories={categories} />
              
              {!imagesPreloaded ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="rounded-lg overflow-hidden shadow-md">
                      <div className="bg-muted h-48 animate-pulse" />
                      <div className="p-4 space-y-3">
                        <div className="h-6 bg-muted animate-pulse rounded" />
                        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                        <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {recentPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
              
              {postsToShow < sortedPosts.length && (
                <div className="mt-8 text-center">
                  <Button
                    onClick={loadMore}
                    className="inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Load More
                  </Button>
                </div>
              )}
              
              {recentPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found</p>
                </div>
              )}
            </section>
            
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Featured Podcasts</h2>
                <Button asChild variant="outline" size="sm">
                  <Link to="/podcast">View All</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <p className="mb-4">Listen to the latest episodes of OMAR WASHE KONDE's podcast, where we discuss important topics with industry experts.</p>
                <Button asChild>
                  <Link to="/podcast" className="flex items-center">
                    <Headphones className="mr-2 h-4 w-4" />
                    Browse Episodes
                  </Link>
                </Button>
              </div>
            </section>
          </div>
          
          {/* Sidebar */}
          <aside className="space-y-6">
            <TrendingPosts posts={posts} />
            
            {/* Poll section with ID for direct link */}
            <div id="polls">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Community Poll</h3>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/polls">More Polls</Link>
                </Button>
              </div>
              <PollWidget poll={samplePoll} onVote={votePoll} />
            </div>
            
            <AffiliateProducts links={affiliateLinks.slice(0, 2)} />
            
            <div className="bg-card rounded-lg p-6 border shadow-sm">
              <h3 className="text-xl font-bold mb-3">Support My Work</h3>
              <p className="text-muted-foreground mb-4">
                If you enjoy the content I create and would like to support me, consider making a donation.
              </p>
              <DonationButton name="OMAR WASHE KONDE" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
