
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, ThumbsUp, MessageSquare, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useBlog } from "@/context/BlogContext";

const AnalyticsDashboard = () => {
  const { posts } = useBlog();
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)), 
    to: new Date()
  });
  
  const [filteredPosts, setFilteredPosts] = useState(posts);
  
  useEffect(() => {
    // Filter posts based on date range
    if (dateRange.from && dateRange.to) {
      const filtered = posts.filter(post => {
        const postDate = new Date(post.publishedDate);
        return postDate >= dateRange.from && postDate <= dateRange.to;
      });
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(posts);
    }
  }, [posts, dateRange]);
  
  // Calculate analytics data
  const totalViews = filteredPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalComments = filteredPosts.reduce((sum, post) => sum + post.comments.length, 0);
  const totalReactions = filteredPosts.reduce((sum, post) => {
    const reactions = post.reactions;
    return sum + reactions.like + reactions.love + reactions.clap;
  }, 0);
  
  // Format data for charts
  const viewsChartData = filteredPosts.slice(0, 10).map(post => ({
    name: post.title.substring(0, 20) + (post.title.length > 20 ? '...' : ''),
    views: post.views || 0
  }));
  
  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from
      });
    }
  };
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        
        <DateRangePicker
          date={dateRange}
          onDateChange={handleDateRangeChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{totalViews}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{totalComments}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ThumbsUp className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{totalReactions}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Views by Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={viewsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPosts
                  .sort((a, b) => (b.views || 0) - (a.views || 0))
                  .slice(0, 5)
                  .map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {index + 1}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium">{post.title}</p>
                          <p className="text-xs text-muted-foreground">{post.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{post.views || 0}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPosts
                  .sort((a, b) => b.comments.length - a.comments.length)
                  .slice(0, 5)
                  .map((post, index) => (
                    <div key={post.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          {index + 1}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium">{post.title}</p>
                          <p className="text-xs text-muted-foreground">{post.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments.length}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
