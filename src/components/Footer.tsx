
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Newsletter } from "./Newsletter";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-10 mt-10 bg-card">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="text-2xl font-bold">BlogApp</Link>
            <p className="mt-2 text-muted-foreground">
              A platform for quality content and knowledge sharing.
            </p>
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <Newsletter />
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t text-center text-muted-foreground text-sm">
          <p>© {currentYear} BlogApp. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link to="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
