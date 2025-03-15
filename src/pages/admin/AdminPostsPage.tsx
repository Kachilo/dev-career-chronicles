
import { useToast } from "@/hooks/use-toast";
import { PostsTable } from "../../components/admin/PostsTable";
import { useBlog } from "../../context/BlogContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPostsPage = () => {
  const { posts, deletePost } = useBlog();
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Current posts in AdminPostsPage:", posts);
  }, [posts]);
  
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
  
  const handleDeletePost = (postId: string) => {
    deletePost(postId);
    
    toast({
      title: "Post deleted",
      description: "The post has been removed successfully."
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <Button asChild>
          <Link to="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-background border rounded-md p-8 text-center">
          <p className="text-muted-foreground mb-4">No posts found</p>
          <Button asChild>
            <Link to="/admin/posts/new">Create your first post</Link>
          </Button>
        </div>
      ) : (
        <PostsTable posts={sortedPosts} onDeletePost={handleDeletePost} />
      )}
    </div>
  );
};

export default AdminPostsPage;
