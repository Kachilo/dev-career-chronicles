
import { useBlog } from "../../context/BlogContext";
import { PostForm } from "../../components/admin/PostForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminCreatePostPage = () => {
  const { addPost } = useBlog();
  const navigate = useNavigate();

  const handleAddPost = (postData: any) => {
    try {
      addPost(postData);
      toast.success("Post created successfully!");
      navigate("/admin/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <PostForm onSave={handleAddPost} />
    </div>
  );
};

export default AdminCreatePostPage;
