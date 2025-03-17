
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Coffee, DollarSign, Heart } from "lucide-react";

export const DonationButton = () => {
  const [amount, setAmount] = useState("5");
  
  const handlePayPalDonation = () => {
    // Replace with actual PayPal donation link
    window.open("https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID", "_blank");
  };
  
  const handleMPesaDonation = () => {
    // This would typically show M-Pesa instructions or initiate an M-Pesa payment
    alert("M-Pesa donation: Send to +254 XXX XXX XXX, Your name as the reference");
  };
  
  const handleBuyMeACoffee = () => {
    // Replace with actual Buy Me A Coffee link
    window.open("https://www.buymeacoffee.com/yourusername", "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
          <Coffee className="mr-2 h-4 w-4" />
          Support Me
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Support My Work</DialogTitle>
        </DialogHeader>
        
        <div className="text-center text-muted-foreground text-sm mb-4">
          Your support helps me create more quality content!
        </div>
        
        <Tabs defaultValue="coffee">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="coffee">Buy Me a Coffee</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
            <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
          </TabsList>
          
          <TabsContent value="coffee" className="text-center">
            <div className="mb-4">
              <Coffee className="h-12 w-12 mx-auto text-amber-500 mb-2" />
              <p className="text-sm">Treat me to a coffee to fuel my next article!</p>
            </div>
            <Button 
              onClick={handleBuyMeACoffee}
              className="w-full bg-amber-500 hover:bg-amber-600"
            >
              Buy Me a Coffee
            </Button>
          </TabsContent>
          
          <TabsContent value="paypal">
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {["5", "10", "20", "50"].map((value) => (
                  <Button
                    key={value}
                    variant={amount === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAmount(value)}
                  >
                    ${value}
                  </Button>
                ))}
              </div>
              
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  min="1"
                />
                <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              
              <Button 
                onClick={handlePayPalDonation}
                className="w-full"
              >
                Donate with PayPal
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="mpesa" className="text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <span className="text-green-600 font-bold">M-PESA</span>
              </div>
              <p className="text-sm">Send your contribution via M-Pesa</p>
            </div>
            <div className="bg-gray-100 p-3 rounded text-sm mb-4">
              <p>Pay to: <strong>+254 XXX XXX XXX</strong></p>
              <p>Reference: <strong>Your Name</strong></p>
            </div>
            <Button 
              onClick={handleMPesaDonation}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Donate with M-Pesa
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
