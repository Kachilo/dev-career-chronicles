
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold text-xl">DevInsights</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className="transition-colors hover:text-primary">
                Home
              </Link>
              <Link to="/categories/freelancing" className="transition-colors hover:text-primary">
                Freelancing
              </Link>
              <Link to="/categories/web-development" className="transition-colors hover:text-primary">
                Web Development
              </Link>
              <Link to="/categories/career" className="transition-colors hover:text-primary">
                Career Growth
              </Link>
              <Link to="/admin" className="transition-colors hover:text-primary">
                Admin
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <Input
                type="search"
                placeholder="Search articles..."
                className="w-[200px] md:w-[250px] pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full" 
                type="submit"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
            
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b">
          <div className="container py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search articles..."
                className="w-full pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full" 
                type="submit"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <nav className="grid gap-2">
              <Link 
                to="/" 
                className="flex items-center py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/categories/freelancing" 
                className="flex items-center py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Freelancing
              </Link>
              <Link 
                to="/categories/web-development" 
                className="flex items-center py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Web Development
              </Link>
              <Link 
                to="/categories/career" 
                className="flex items-center py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Career Growth
              </Link>
              <Link 
                to="/admin" 
                className="flex items-center py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
