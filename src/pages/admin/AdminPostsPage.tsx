
import { useToast } from "@/hooks/use-toast";
import { PostsTable } from "../../components/admin/PostsTable";
import { useBlog } from "../../context/BlogContext";

const AdminPostsPage = () => {
  const { posts, deletePost } = useBlog();
  const { toast } = useToast();
  
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
  
  const handleDeletePost = (postId: string) => {
    deletePost(postId);
    
    toast({
      title: "Post deleted",
      description: "The post has been removed successfully.",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Blog Posts</h2>
      <PostsTable posts={sortedPosts} onDeletePost={handleDeletePost} />
    </div>
  );
};

export default AdminPostsPage;
