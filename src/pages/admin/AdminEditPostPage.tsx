
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { PostForm } from "../../components/admin/PostForm";

const AdminEditPostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const { posts, updatePost } = useBlog();
  const navigate = useNavigate();
  
  const post = posts.find(p => p.id === postId);
  
  useEffect(() => {
    if (!post && postId) {
      navigate("/admin/posts");
    }
  }, [post, postId, navigate]);
  
  if (!post) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
      <PostForm post={post} onSave={(postData) => updatePost(post.id, postData)} />
    </div>
  );
};

export default AdminEditPostPage;
