
import { useBlog } from "../../context/BlogContext";
import { PostForm } from "../../components/admin/PostForm";

const AdminCreatePostPage = () => {
  const { addPost } = useBlog();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <PostForm onSave={addPost} />
    </div>
  );
};

export default AdminCreatePostPage;
