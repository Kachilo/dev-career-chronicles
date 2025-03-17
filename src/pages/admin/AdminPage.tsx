
import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenLine, Users, BarChart2 } from "lucide-react";
import { AdminPinScreen } from "../../components/admin/AdminPinScreen";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <AdminPinScreen onSuccess={() => setIsAuthenticated(true)} />;
  }
  
  const isPostsPath = location.pathname === "/admin" || location.pathname === "/admin/posts";
  const isCommentsPath = location.pathname === "/admin/comments";
  const isPollsPath = location.pathname === "/admin/polls";

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        
        <div className="flex gap-2 border-b pb-4 mb-6">
          <Button
            variant={isPostsPath ? "default" : "outline"}
            asChild
          >
            <Link to="/admin/posts">
              <PenLine className="h-4 w-4 mr-2" />
              Manage Posts
            </Link>
          </Button>
          
          <Button
            variant={isCommentsPath ? "default" : "outline"}
            asChild
          >
            <Link to="/admin/comments">
              <Users className="h-4 w-4 mr-2" />
              Manage Comments
            </Link>
          </Button>
          
          <Button
            variant={isPollsPath ? "default" : "outline"}
            asChild
          >
            <Link to="/admin/polls">
              <BarChart2 className="h-4 w-4 mr-2" />
              Manage Polls
            </Link>
          </Button>
        </div>
      </div>
      
      <Outlet />
    </div>
  );
};

export default AdminPage;
