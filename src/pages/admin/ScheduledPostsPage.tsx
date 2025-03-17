
import { useState } from "react";
import { useBlog } from "../../context/BlogContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Edit, Search, Trash, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ScheduledPost {
  id: string;
  title: string;
  publishDate: string;
  status: "scheduled" | "published" | "draft";
  category: string;
}

// Mock data for scheduled posts (in a real app, this would come from API/database)
const mockScheduledPosts: ScheduledPost[] = [
  {
    id: "scheduled-1",
    title: "10 Tips for Better SEO Rankings in 2025",
    publishDate: "2025-04-15T08:00:00.000Z",
    status: "scheduled",
    category: "marketing"
  },
  {
    id: "scheduled-2",
    title: "Remote Work Best Practices for Tech Teams",
    publishDate: "2025-05-01T10:30:00.000Z",
    status: "scheduled",
    category: "business"
  },
  {
    id: "scheduled-3",
    title: "The Rise of AI in Content Creation",
    publishDate: "2025-04-22T12:00:00.000Z",
    status: "scheduled",
    category: "technology"
  }
];

const ScheduledPostsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(mockScheduledPosts);
  
  // Filter posts by search term
  const filteredPosts = scheduledPosts.filter(
    post => post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePublishNow = (postId: string) => {
    // Implement publishing logic here
    console.log(`Publishing post: ${postId}`);
    setScheduledPosts(
      scheduledPosts.map(post => 
        post.id === postId ? { ...post, status: "published" as const } : post
      )
    );
  };
  
  const handleReschedule = (postId: string) => {
    // Implement rescheduling logic here
    console.log(`Rescheduling post: ${postId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Scheduled Posts</h2>
      
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search scheduled posts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button asChild>
          <Link to="/admin/posts/new">
            Create New Post
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Publications</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPosts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Scheduled For</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {post.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.publishDate).toLocaleDateString()} at {new Date(post.publishDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'outline' : 'secondary'}>
                        {post.status === 'scheduled' && <Clock className="h-3 w-3 mr-1 inline" />}
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={post.status === 'published'}
                          onClick={() => handlePublishNow(post.id)} 
                          title="Publish now"
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={post.status === 'published'}
                          onClick={() => handleReschedule(post.id)} 
                          title="Reschedule"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          asChild
                          title="Edit post"
                        >
                          <Link to={`/admin/posts/edit/${post.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              {searchTerm ? "No posts match your search" : "No scheduled posts found"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduledPostsPage;
