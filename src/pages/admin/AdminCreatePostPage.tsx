
import { useBlog } from "../../context/BlogContext";
import { PostForm } from "../../components/admin/PostForm";
import { useState } from "react";
import { Spinner } from "../../components/ui/spinner";

const AdminCreatePostPage = () => {
  const { addPost } = useBlog();
  const [isLoading, setIsLoading] = useState(false);

  const handleSavePost = async (postData: any) => {
    setIsLoading(true);
    try {
      await addPost(postData);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <PostForm onSave={handleSavePost} />
    </div>
  );
};

export default AdminCreatePostPage;
