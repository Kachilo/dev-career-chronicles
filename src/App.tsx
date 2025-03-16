
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BlogProvider } from "./context/BlogContext";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import BlogPostPage from "./pages/BlogPostPage";
import SearchPage from "./pages/SearchPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import AdminCommentsPage from "./pages/admin/AdminCommentsPage";
import AdminCreatePostPage from "./pages/admin/AdminCreatePostPage";
import AdminEditPostPage from "./pages/admin/AdminEditPostPage";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";

function App() {
  return (
    <BlogProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<HomePage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              <Route path="/admin" element={<AdminPage />}>
                <Route index element={<AdminPostsPage />} />
                <Route path="posts" element={<AdminPostsPage />} />
                <Route path="posts/new" element={<AdminCreatePostPage />} />
                <Route path="posts/edit/:id" element={<AdminEditPostPage />} />
                <Route path="comments" element={<AdminCommentsPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton phoneNumber="+254725409996" />
          <Toaster />
        </div>
      </Router>
    </BlogProvider>
  );
}

export default App;
