
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BlogProvider } from "./context/BlogContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import BlogPostPage from "./pages/BlogPostPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import AdminCreatePostPage from "./pages/admin/AdminCreatePostPage";
import AdminEditPostPage from "./pages/admin/AdminEditPostPage";
import AdminCommentsPage from "./pages/admin/AdminCommentsPage";
import AdminImportDataPage from "./pages/admin/AdminImportDataPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BlogProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/categories/:slug" element={<CategoryPage />} />
                <Route path="/search" element={<SearchPage />} />
                
                <Route path="/admin" element={<AdminPage />}>
                  <Route index element={<AdminPostsPage />} />
                  <Route path="posts" element={<AdminPostsPage />} />
                  <Route path="posts/new" element={<AdminCreatePostPage />} />
                  <Route path="posts/edit/:postId" element={<AdminEditPostPage />} />
                  <Route path="comments" element={<AdminCommentsPage />} />
                  <Route path="import" element={<AdminImportDataPage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </BlogProvider>
  </QueryClientProvider>
);

export default App;
