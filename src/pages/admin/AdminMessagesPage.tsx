
import { useState } from "react";
import { useBlog } from "@/context/BlogContext";
import { formatDistanceToNow } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Inbox, Reply, Eye, MessageCircle, Check, Clock, Phone, User, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const replySchema = z.object({
  reply: z.string().min(5, { message: "Reply must be at least 5 characters." }),
});

type ReplyFormValues = z.infer<typeof replySchema>;

const AdminMessagesPage = () => {
  const { messages, markMessageAsRead, replyToMessage } = useBlog();
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const selectedMessage = messages.find(message => message.id === selectedMessageId);
  
  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply: "",
    },
  });
  
  const unreadMessages = messages.filter(message => !message.is_read);
  const repliedMessages = messages.filter(message => message.admin_reply);
  const unreadCount = unreadMessages.length;
  
  const filteredMessages = messages.filter(message => 
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.phone_number.includes(searchQuery)
  );
  
  const handleViewMessage = (messageId: string) => {
    setSelectedMessageId(messageId);
    setViewDialogOpen(true);
    
    // Mark as read if not already
    const message = messages.find(m => m.id === messageId);
    if (message && !message.is_read) {
      markMessageAsRead(messageId);
    }
  };
  
  const handleReplyButton = (messageId: string) => {
    setSelectedMessageId(messageId);
    setReplyDialogOpen(true);
    
    // Mark as read if not already
    const message = messages.find(m => m.id === messageId);
    if (message && !message.is_read) {
      markMessageAsRead(messageId);
    }
  };
  
  const handleSubmitReply = async (data: ReplyFormValues) => {
    if (!selectedMessageId) return;
    
    setIsSubmitting(true);
    
    try {
      await replyToMessage(selectedMessageId, data.reply);
      
      toast.success("Reply sent!", {
        description: "Your reply has been sent successfully.",
      });
      
      form.reset();
      setReplyDialogOpen(false);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Error sending reply", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderMessageCard = (message: any) => (
    <Card key={message.id} className={`transition-all hover:shadow-md ${!message.is_read ? "border-primary" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                {!message.is_read && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
                {message.name}
              </CardTitle>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{message.phone_number}</span>
                <span className="mx-1">•</span>
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-2">{message.message}</p>
        {message.admin_reply && (
          <div className="mt-2 pt-2 border-t flex items-start gap-2">
            <Reply className="h-3 w-3 text-muted-foreground mt-1" />
            <p className="text-xs line-clamp-1 text-muted-foreground">{message.admin_reply}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => handleViewMessage(message.id)}>
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleReplyButton(message.id)}>
          <Reply className="h-3 w-3 mr-1" />
          {message.admin_reply ? "Edit Reply" : "Reply"}
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Messages</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">{unreadCount} unread</Badge>
          )}
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            className="pl-9 w-full sm:w-[250px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {messages.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Inbox className="h-4 w-4" />
              All
              <Badge variant="secondary" className="ml-1">{messages.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="replied" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Replied
              <Badge variant="secondary" className="ml-1">{repliedMessages.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMessages.map(renderMessageCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="unread" className="mt-0">
            {unreadMessages.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-8">
                  <Check className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No unread messages</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unreadMessages.filter(message => 
                  message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  message.message.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(renderMessageCard)}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="replied" className="mt-0">
            {repliedMessages.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-8">
                  <Reply className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">No replied messages</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {repliedMessages.filter(message => 
                  message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  message.message.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(renderMessageCard)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              {selectedMessage?.phone_number} · {selectedMessage && formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </h4>
              <div className="rounded-md bg-muted p-3">
                <p className="whitespace-pre-wrap break-words">{selectedMessage?.message}</p>
              </div>
            </div>
            
            {selectedMessage?.admin_reply && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Reply className="h-4 w-4" />
                  Your Reply
                </h4>
                <div className="rounded-md bg-muted p-3">
                  <p className="whitespace-pre-wrap break-words">{selectedMessage?.admin_reply}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-start">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
            
            <Button 
              type="button" 
              onClick={() => {
                setViewDialogOpen(false);
                setTimeout(() => {
                  handleReplyButton(selectedMessage?.id || "");
                }, 100);
              }}
            >
              {selectedMessage?.admin_reply ? "Edit Reply" : "Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Send a response to this message
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitReply)} className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Original Message:</h4>
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm">{selectedMessage?.message}</p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="reply"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Type your reply here..."
                        className="min-h-[120px]"
                        defaultValue={selectedMessage?.admin_reply || ""}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter className="sm:justify-start">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setReplyDialogOpen(false)}
                >
                  Cancel
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Reply"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMessagesPage;
