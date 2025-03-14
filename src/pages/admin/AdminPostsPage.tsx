
import { useBlog } from "../../context/BlogContext";
import { PostsTable } from "../../components/admin/PostsTable";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const AdminPostsPage = () => {
  const { posts, deletePost, loading } = useBlog();
  
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
  
  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      
      toast({
        title: "Post deleted",
        description: "The post has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Manage Blog Posts</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="border rounded-md">
            <div className="p-4">
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Blog Posts</h2>
      <PostsTable posts={sortedPosts} onDeletePost={handleDeletePost} />
    </div>
  );
};

export default AdminPostsPage;
