
import { useState } from "react";
import { useBlog } from "../../context/BlogContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { CalendarDateRangePicker } from "../../components/ui/date-range-picker";

const AnalyticsDashboard = () => {
  const { posts } = useBlog();
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });

  // Calculate total views
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  
  // Calculate total comments
  const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
  
  // Calculate average comments per post
  const avgCommentsPerPost = posts.length ? (totalComments / posts.length).toFixed(1) : "0";
  
  // Generate view data for bar chart
  const viewsData = posts
    .slice(0, 10) // Top 10 posts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .map(post => ({
      name: post.title.length > 20 ? post.title.substring(0, 20) + "..." : post.title,
      views: post.views || 0,
    }));
    
  // Generate category data for pie chart
  const categoryData = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + (post.views || 0);
    return acc;
  }, {} as Record<string, number>);
  
  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <CalendarDateRangePicker dateRange={dateRange} onUpdate={setDateRange} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Views</CardTitle>
            <CardDescription>Across all blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Comments</CardTitle>
            <CardDescription>Reader engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalComments.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Avg Comments</CardTitle>
            <CardDescription>Per blog post</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgCommentsPerPost}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="views">
        <TabsList className="mb-4">
          <TabsTrigger value="views">Views by Post</TabsTrigger>
          <TabsTrigger value="categories">Views by Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Most Viewed Posts</CardTitle>
              <CardDescription>Top 10 posts by view count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={viewsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Views by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} views`, 'Views']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
