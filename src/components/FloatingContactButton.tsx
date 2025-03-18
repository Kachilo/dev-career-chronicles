
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import ContactForm from "./ContactForm";
import { useMediaQuery } from "@/hooks/use-media-query";

const FloatingContactButton = () => {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button 
            className="fixed bottom-6 right-6 rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center z-50 bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-label="Contact us"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="p-4 max-h-[80vh] overflow-auto">
          <div className="px-2">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ContactForm onClose={() => setOpen(false)} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center z-50 bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Contact us"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent side="left" align="end" className="w-80 p-0">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ContactForm isCompact />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default FloatingContactButton;
