
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { categories } from "../data/blogData";

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the popup has already been shown in this session
    const hasShownPopup = sessionStorage.getItem("hasShownWelcomePopup");
    
    if (!hasShownPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("hasShownWelcomePopup", "true");
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Our Blog!</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Explore our topics and discover valuable content
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium mb-3">Popular Categories:</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={() => setIsOpen(false)}>Get Started</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
