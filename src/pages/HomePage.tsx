
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
  
  // Get recent posts
  const recentPosts = sortedPosts.slice(0, postsToShow);
  
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
    <div className="flex flex-col">
      {/* Hero Section - Full height with improved organization */}
      <section className="relative h-screen w-full overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <HeroSlider />
        </div>
        <div className="relative z-10 container mx-auto flex flex-col items-center justify-center h-full px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Welcome to OMAR WASHE KONDE
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto drop-shadow-md">
            Insights, ideas, and inspiration for your personal and professional growth
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/categories/all" className="flex items-center">
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
      </section>
      
      {/* Featured Content Section with improved spacing */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <FeaturedContent />
        </div>
      </section>
      
      {/* Main Content Section with improved organization */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-16">
              {/* Recent Posts */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">Recent Articles</h2>
                  <Button asChild variant="outline">
                    <Link to="/categories/all">View All</Link>
                  </Button>
                </div>
                
                <CategoryList categories={categories} />
                
                <div className="mt-8">
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
                </div>
                
                {postsToShow < sortedPosts.length && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={loadMore}
                      variant="secondary"
                    >
                      Load More
                    </Button>
                  </div>
                )}
                
                {recentPosts.length === 0 && (
                  <div className="text-center py-12 bg-card rounded-lg shadow-sm">
                    <p className="text-muted-foreground">No articles found</p>
                  </div>
                )}
              </div>
              
              {/* Featured Podcasts Section */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold">Featured Podcasts</h2>
                  <Button asChild variant="outline">
                    <Link to="/podcast">View All</Link>
                  </Button>
                </div>
                
                <div className="bg-card rounded-lg p-8 shadow-sm border">
                  <p className="mb-6 text-lg">Listen to the latest episodes of OMAR WASHE KONDE's podcast, where we discuss important topics with industry experts.</p>
                  <Button asChild size="lg">
                    <Link to="/podcast" className="flex items-center">
                      <Headphones className="mr-2 h-5 w-5" />
                      Browse Episodes
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <aside className="space-y-10">
              <div className="bg-card rounded-lg p-6 border shadow-sm">
                <h3 className="text-xl font-bold mb-4">Support My Work</h3>
                <p className="text-muted-foreground mb-6">
                  If you enjoy the content I create and would like to support me, consider making a donation.
                </p>
                <DonationButton name="OMAR WASHE KONDE" />
              </div>
              
              <TrendingPosts posts={posts} />
              
              {/* Poll section with ID for direct link */}
              <div id="polls" className="bg-card rounded-lg p-6 border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Community Poll</h3>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/polls">More Polls</Link>
                  </Button>
                </div>
                <PollWidget poll={samplePoll} onVote={votePoll} />
              </div>
              
              <AffiliateProducts links={affiliateLinks.slice(0, 2)} />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
