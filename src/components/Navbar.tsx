
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Search, Menu, X, Home, User, Info, Mail, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
            
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/" className={navigationMenuTriggerStyle()}>
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/podcast" className={navigationMenuTriggerStyle()}>
                      <Headphones className="mr-2 h-4 w-4" />
                      Podcast
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <Info className="mr-2 h-4 w-4" />
                      About
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <a
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/about"
                            >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                About DevInsights
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Learn more about our mission to provide valuable insights for developers and professionals.
                              </p>
                            </a>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <Link
                            to="/about/team"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Our Team</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Meet the experts behind DevInsights
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/about/mission"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Our Mission</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              What drives us to create quality content
                            </p>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        <li>
                          <Link
                            to="/categories/freelancing"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Freelancing</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Tips and strategies for successful freelancing
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/categories/web-development"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Web Development</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Tutorials and best practices for modern web development
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/categories/career"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Career Growth</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Advice for professional development and advancement
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/categories/digital-marketing"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Digital Marketing</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Strategies for online promotion and growth
                            </p>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/contact" className={navigationMenuTriggerStyle()}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link to="/admin" className={navigationMenuTriggerStyle()}>
                      <User className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
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
                <Home className="mr-2 h-5 w-5" />
                Home
              </Link>
              <Link 
                to="/podcast" 
                className="flex items-center py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Headphones className="mr-2 h-5 w-5" />
                Podcast
              </Link>
              <Link 
                to="/about" 
                className="flex items-center py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Info className="mr-2 h-5 w-5" />
                About
              </Link>
              <Link 
                to="/contact" 
                className="flex items-center py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail className="mr-2 h-5 w-5" />
                Contact
              </Link>
              <Link 
                to="/admin" 
                className="flex items-center py-2 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="mr-2 h-5 w-5" />
                Admin
              </Link>
              
              <div className="pt-2 mt-2 border-t">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="grid gap-1">
                  <Link 
                    to="/categories/freelancing" 
                    className="py-1 pl-2 hover:bg-accent hover:text-accent-foreground rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Freelancing
                  </Link>
                  <Link 
                    to="/categories/web-development" 
                    className="py-1 pl-2 hover:bg-accent hover:text-accent-foreground rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Web Development
                  </Link>
                  <Link 
                    to="/categories/career" 
                    className="py-1 pl-2 hover:bg-accent hover:text-accent-foreground rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Career Growth
                  </Link>
                  <Link 
                    to="/categories/digital-marketing" 
                    className="py-1 pl-2 hover:bg-accent hover:text-accent-foreground rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Digital Marketing
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
