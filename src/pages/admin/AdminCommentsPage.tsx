
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ExternalLink } from "lucide-react";
import { useBlog } from "../../context/BlogContext";

const AdminCommentsPage = () => {
  const { posts } = useBlog();
  const [searchTerm, setSearchTerm] = useState("");
  
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
