
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "./ContactForm";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

const FloatingContactButton = () => {
  const [isHoverCardOpen, setIsHoverCardOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  return (
    <>
      {isDesktop ? (
        // Desktop version - use hover card
        <HoverCard open={isHoverCardOpen} onOpenChange={setIsHoverCardOpen}>
          <HoverCardTrigger asChild>
            <Button 
              size="icon" 
              className="fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
            >
              {isHoverCardOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MessageCircle className="h-6 w-6" />
              )}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent 
            align="end" 
            className="w-80 p-0 shadow-lg" 
            sideOffset={16}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Contact Us</CardTitle>
                <CardDescription>
                  Send us a message and we'll get back to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </HoverCardContent>
        </HoverCard>
      ) : (
        // Mobile version - use drawer
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              size="icon" 
              className="fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Contact Us</DrawerTitle>
              <DrawerDescription>
                Send us a message and we'll get back to you
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <ContactForm />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default FloatingContactButton;
