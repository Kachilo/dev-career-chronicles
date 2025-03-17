
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { CommentSection } from "../components/CommentSection";
import { ShareButtons } from "../components/ShareButtons";
import { RelatedPosts } from "../components/RelatedPosts";
import { TrendingPosts } from "../components/TrendingPosts";
import { PollWidget } from "../components/PollWidget";
import { AffiliateProducts } from "../components/AffiliateProducts";
import { DonationButton } from "../components/DonationButton";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Eye } from "lucide-react";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { 
    posts, 
    getPostBySlug, 
    addComment, 
    deleteComment, 
    likeComment,
    dislikeComment,
    incrementViews,
    polls,
    affiliateLinks,
    votePoll
  } = useBlog();
  const navigate = useNavigate();
  
  const post = getPostBySlug(slug || "");
  
  useEffect(() => {
    if (!post && slug) {
      navigate("/not-found");
      return;
    }
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Increment view count
    if (post) {
      incrementViews(post.id);
    }
  }, [post, slug, navigate, incrementViews]);
  
  if (!post) {
    return null;
  }
  
  const formattedDate = new Date(post.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get the current URL for sharing
  const postUrl = window.location.href;
  
  // Find a poll for this post if one exists
  const postPoll = polls.find(poll => poll.postId === post.id);
  
  // Get affiliate links related to the post's category
  const relatedAffiliateLinks = affiliateLinks.filter(link => 
    link.category === post.category
  );

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <article className="md:col-span-2">
          <header className="mb-8">
            <Badge variant="secondary" className="mb-4 capitalize">
              {post.category}
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-4">
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4" />
                <span>{post.author}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                <span>{post.views || 0} views</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full h-64 md:h-96 object-cover rounded-lg"
            />
          </header>
          
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-8 pt-6 border-t flex justify-between items-center">
            <ShareButtons title={post.title} url={postUrl} />
            <DonationButton />
          </div>
          
          <div className="mt-12">
            <CommentSection 
              postId={post.id}
              comments={post.comments}
              onAddComment={(comment) => addComment(post.id, comment)}
              onDeleteComment={(commentId) => deleteComment(post.id, commentId)}
              onLikeComment={(commentId) => likeComment(post.id, commentId)}
              onDislikeComment={(commentId) => dislikeComment(post.id, commentId)}
            />
          </div>
          
          <RelatedPosts currentPostId={post.id} posts={posts} />
        </article>
        
        <aside className="space-y-6">
          <TrendingPosts posts={posts} />
          
          {postPoll && (
            <PollWidget 
              poll={postPoll} 
              onVote={votePoll} 
            />
          )}
          
          {relatedAffiliateLinks.length > 0 && (
            <AffiliateProducts links={relatedAffiliateLinks} />
          )}
          
          {/* Add a default poll if no post-specific poll exists */}
          {!postPoll && (
            <PollWidget 
              poll={{
                id: "default-poll",
                question: "What topics would you like to see more of?",
                options: [
                  { id: "opt-1", text: "Web Development", votes: 45 },
                  { id: "opt-2", text: "Freelancing Tips", votes: 32 },
                  { id: "opt-3", text: "Digital Marketing", votes: 28 },
                  { id: "opt-4", text: "Business Strategy", votes: 19 }
                ],
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
              }} 
              onVote={votePoll} 
            />
          )}
        </aside>
      </div>
    </div>
  );
};

export default BlogPostPage;
