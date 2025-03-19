
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import DonationButton from "./DonationButton";

export const SupportPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    // Check if user has dismissed the popup recently
    const lastDismissed = localStorage.getItem('supportPopupDismissed');
    if (lastDismissed) {
      const dismissedTime = parseInt(lastDismissed, 10);
      const now = Date.now();
      // If it's been less than 30 minutes since dismissal, don't show
      if (now - dismissedTime < 30 * 60 * 1000) {
        setDismissed(true);
      }
    }
    
    // Show popup every 5 minutes if not dismissed
    const interval = setInterval(() => {
      if (!dismissed) {
        setIsVisible(true);
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 15000);
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    // Show popup initially after 10 seconds
    const initialTimer = setTimeout(() => {
      if (!dismissed) {
        setIsVisible(true);
      }
    }, 10000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [dismissed]);
  
  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('supportPopupDismissed', Date.now().toString());
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-24 right-24 z-50 max-w-md bg-background border rounded-lg shadow-lg p-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Support DevInsights</h3>
        <p className="text-muted-foreground text-sm">
          We're dedicated to bringing you quality content. If you find our articles helpful, consider supporting us to keep this resource free for everyone.
        </p>
        <div className="flex justify-center">
          <DonationButton />
        </div>
      </div>
    </div>
  );
};

export default SupportPopup;
