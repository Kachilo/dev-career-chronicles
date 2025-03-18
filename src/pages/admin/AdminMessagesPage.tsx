
import { useState } from "react";
import { useBlog } from "../../context/BlogContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Search, MessageSquareText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const AdminMessagesPage = () => {
  const { messages, markMessageAsRead, replyToMessage } = useBlog();
  const { toast } = useToast();
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter messages based on tab and search query
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.phone_number.includes(searchQuery);
      
    if (activeTab === "unread") return !message.is_read && matchesSearch;
    if (activeTab === "replied") return message.admin_reply && matchesSearch;
    return matchesSearch;
  });
  
  const unreadCount = messages.filter(message => !message.is_read).length;
  const repliedCount = messages.filter(message => message.admin_reply).length;
  
  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      toast({
        title: "Message marked as read",
        description: "The message has been marked as read.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark message as read.",
        variant: "destructive",
      });
    }
  };
  
  const handleReply = async (id: string) => {
    if (!replyContent[id]?.trim()) {
      toast({
        title: "Empty reply",
        description: "Please enter a reply message.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await replyToMessage(id, replyContent[id]);
      setReplyContent({ ...replyContent, [id]: "" });
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Messages</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All Messages
            <Badge variant="secondary" className="ml-2">{messages.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="replied">
            Replied
            <Badge variant="secondary" className="ml-2">{repliedCount}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredMessages.length > 0 ? renderMessages(filteredMessages) : renderEmptyState()}
        </TabsContent>
        
        <TabsContent value="unread" className="space-y-4">
          {filteredMessages.length > 0 ? renderMessages(filteredMessages) : renderEmptyState("No unread messages")}
        </TabsContent>
        
        <TabsContent value="replied" className="space-y-4">
          {filteredMessages.length > 0 ? renderMessages(filteredMessages) : renderEmptyState("No replied messages")}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderMessages(messagesToRender: typeof messages) {
    return messagesToRender.map((message) => (
      <Card key={message.id} className={message.is_read ? "" : "border-l-4 border-l-primary"}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {message.name}
                {!message.is_read && (
                  <Badge variant="default" className="ml-2">New</Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                Phone: {message.phone_number} • 
                {message.created_at && (
                  <span className="ml-1">
                    {format(new Date(message.created_at), "PPP p")}
                  </span>
                )}
              </CardDescription>
            </div>
            {!message.is_read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(message.id)}
                title="Mark as read"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="whitespace-pre-wrap">{message.message}</p>
          </div>
          
          {message.admin_reply && (
            <div className="pl-4 border-l-2 border-primary">
              <p className="font-medium text-sm text-muted-foreground mb-1">Your reply:</p>
              <p className="whitespace-pre-wrap">{message.admin_reply}</p>
            </div>
          )}
          
          {!message.admin_reply && (
            <div className="space-y-2">
              <Textarea
                placeholder="Type your reply here..."
                className="min-h-24"
                value={replyContent[message.id] || ""}
                onChange={(e) => setReplyContent({
                  ...replyContent,
                  [message.id]: e.target.value
                })}
              />
            </div>
          )}
        </CardContent>
        
        {!message.admin_reply && (
          <CardFooter className="flex justify-end pt-0">
            <Button 
              onClick={() => handleReply(message.id)}
              disabled={!replyContent[message.id]?.trim()}
            >
              <MessageSquareText className="mr-2 h-4 w-4" />
              Send Reply
            </Button>
          </CardFooter>
        )}
      </Card>
    ));
  }
  
  function renderEmptyState(message = "No messages found") {
    return (
      <div className="bg-background border rounded-md p-8 text-center">
        <p className="text-muted-foreground mb-2">{message}</p>
      </div>
    );
  }
};

export default AdminMessagesPage;
