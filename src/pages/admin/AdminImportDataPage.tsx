
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { blogPosts } from "../../data/blogData";
import { supabase } from "@/integrations/supabase/client";

const AdminImportDataPage = () => {
  const [pin, setPin] = useState("");
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!pin) {
      toast({
        title: "Pin required",
        description: "Please enter the admin PIN to continue.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setImporting(true);
      
      // Call the Supabase Edge Function to import initial data
      const { data, error } = await supabase.functions.invoke('import-initial-posts', {
        body: {
          pin,
          posts: blogPosts
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Initial blog data has been imported successfully."
      });
    } catch (error) {
      console.error("Import error:", error);
      
      toast({
        title: "Import failed",
        description: error.message || "Failed to import blog data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Import Initial Data</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Import Blog Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              This tool allows you to import the initial blog posts from your local data into the Supabase database.
              You'll need an admin PIN to proceed.
            </p>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter admin PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={importing}
              />
            </div>
            
            <Button
              onClick={handleImport}
              disabled={importing || !pin}
              className="w-full"
            >
              {importing ? "Importing..." : "Import Data"}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Note: This will import {blogPosts.length} blog posts along with their comments from your initial data set.
              Existing posts with the same IDs will be updated.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminImportDataPage;
