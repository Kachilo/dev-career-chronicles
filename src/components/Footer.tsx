
import { Link } from "react-router-dom";
import { Newsletter } from "./Newsletter";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">DevInsights</h3>
            <p className="text-muted-foreground max-w-xs">
              Insights on freelancing, web development, and career development for modern professionals.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/categories/freelancing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Freelancing
                </Link>
              </li>
              <li>
                <Link to="/categories/web-development" className="text-muted-foreground hover:text-foreground transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/categories/career" className="text-muted-foreground hover:text-foreground transition-colors">
                  Career Growth
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <Newsletter />
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DevInsights. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
