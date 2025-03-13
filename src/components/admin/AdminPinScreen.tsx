
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminPinScreenProps {
  onSuccess: () => void;
}

const ADMIN_PIN = "1352";

export const AdminPinScreen = ({ onSuccess }: AdminPinScreenProps) => {
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pin) {
      setError("Please enter the PIN");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    setTimeout(() => {
      if (pin === ADMIN_PIN) {
        toast({
          title: "Access granted",
          description: "Welcome to the admin panel",
        });
        onSuccess();
      } else {
        setError("Invalid PIN. Please try again.");
        toast({
          title: "Access denied",
          description: "The PIN you entered is incorrect",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <LockKeyhole className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter your admin PIN to access the blog management panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={10}
                className="text-center text-lg tracking-widest"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Access Admin Panel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
