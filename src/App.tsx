
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import BlogPostPage from "./pages/BlogPostPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import AdminCommentsPage from "./pages/admin/AdminCommentsPage";
import AdminPollsPage from "./pages/admin/AdminPollsPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";
import AdminCreatePostPage from "./pages/admin/AdminCreatePostPage";
import AdminEditPostPage from "./pages/admin/AdminEditPostPage";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { BlogProvider } from "@/context/BlogContext";
import { Toaster } from "sonner";
import FloatingContactButton from "@/components/FloatingContactButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import SupportPopup from "@/components/SupportPopup";

function App() {
  return (
    <BrowserRouter>
      <BlogProvider>
        <ThemeProvider defaultTheme="system" storageKey="blog-theme">
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/categories/:slug" element={<CategoryPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/contact" element={<ContactPage />} />
                
                <Route path="/admin" element={<AdminPage />}>
                  <Route index element={<AdminPostsPage />} />
                  <Route path="posts" element={<AdminPostsPage />} />
                  <Route path="posts/new" element={<AdminCreatePostPage />} />
                  <Route path="posts/edit/:postId" element={<AdminEditPostPage />} />
                  <Route path="comments" element={<AdminCommentsPage />} />
                  <Route path="polls" element={<AdminPollsPage />} />
                  <Route path="messages" element={<AdminMessagesPage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            
            <Footer />
            <FloatingContactButton />
            <WhatsAppButton />
            <SupportPopup />
            <Toaster />
          </div>
        </ThemeProvider>
      </BlogProvider>
    </BrowserRouter>
  );
}

export default App;
