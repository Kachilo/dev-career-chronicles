
import { Link } from "react-router-dom";
import { Newsletter } from "./Newsletter";
import { Facebook, Instagram, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">DevInsights</h3>
            <p className="text-muted-foreground max-w-xs">
              Insights on freelancing, web development, and career development for modern professionals.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="mailto:contact@devinsights.com" className="hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Explore</h3>
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
              <li>
                <Link to="/categories/digital-marketing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Digital Marketing
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
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
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              TikTok
            </a>
            <a href="https://www.upwork.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Upwork
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              WhatsApp
            </a>
            <a href="https://gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Gmail
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
