
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Search, Trash2, ExternalLink } from "lucide-react";
import { useBlog } from "../../context/BlogContext";
import { useToast } from "@/hooks/use-toast";

const AdminCommentsPage = () => {
  const { posts, deleteComment } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Extract all comments from all posts
  const allComments = posts.flatMap(post => 
    post.comments.map(comment => ({
      ...comment,
      postId: post.id,
      postTitle: post.title,
      postSlug: post.slug
    }))
  );
  
  // Sort comments by date (newest first)
  const sortedComments = [...allComments].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Filter comments by search term
  const filteredComments = sortedComments.filter(comment =>
    comment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.postTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDeleteComment = (postId: string, commentId: string) => {
    deleteComment(postId, commentId);
    
    toast({
      title: "Comment deleted",
      description: "The comment has been removed successfully.",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Comments</h2>
      
      <div className="space-y-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search comments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredComments.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Author</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead className="hidden md:table-cell">Post</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.map((comment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="font-medium">
                      {comment.name}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {comment.content}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="truncate">{comment.postTitle}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(comment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          asChild
                          title="View post"
                          aria-label="View post"
                        >
                          <Link to={`/blog/${comment.postSlug}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              title="Delete comment"
                              aria-label="Delete comment"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this comment? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteComment(comment.postId, comment.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-md border p-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                {searchTerm ? "No matching comments found" : "No comments to moderate"}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCommentsPage;
