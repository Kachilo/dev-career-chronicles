
import { useState } from "react";
import { useBlog } from "@/context/BlogContext";
import { formatDistanceToNow } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Inbox, Reply, Eye, MessageSquare } from "lucide-react";
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
  
  const selectedMessage = messages.find(message => message.id === selectedMessageId);
  
  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply: "",
    },
  });
  
  const unreadCount = messages.filter(message => !message.is_read).length;
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Messages</h2>
          <Badge variant="secondary" className="ml-2">{unreadCount} unread</Badge>
        </div>
      </div>
      
      {messages.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Inbox className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((message) => (
            <Card key={message.id} className={!message.is_read ? "border-primary" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {!message.is_read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                      {message.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {message.phone_number} · {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleViewMessage(message.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleReplyButton(message.id)}>
                      <Reply className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{message.message}</p>
                {message.admin_reply && (
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs font-semibold text-muted-foreground">Your reply:</p>
                    <p className="text-sm line-clamp-1">{message.admin_reply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
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
                <MessageSquare className="h-4 w-4" />
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
