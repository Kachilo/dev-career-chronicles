
import { useState } from "react";
import { Poll, PollOption } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface PollWidgetProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  onDelete?: (pollId: string) => void;
  onEdit?: (pollId: string, updatedPoll: Omit<Poll, "id">) => void;
  isAdmin?: boolean;
}

export const PollWidget = ({ poll, onVote, onDelete, onEdit, isAdmin = false }: PollWidgetProps) => {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(poll.question);
  const [editedOptions, setEditedOptions] = useState<PollOption[]>([...poll.options]);
  const [editedEndDate, setEditedEndDate] = useState(
    new Date(poll.endDate).toISOString().split("T")[0]
  );
  
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  
  const handleVote = () => {
    if (selectedOption) {
      onVote(poll.id, selectedOption);
      setVoted(true);
      toast.success("Your vote has been recorded");
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(poll.id);
      toast.success("Poll deleted successfully");
    }
  };
  
  const handleEditOption = (id: string, newText: string) => {
    setEditedOptions(
      editedOptions.map((option) =>
        option.id === id ? { ...option, text: newText } : option
      )
    );
  };
  
  const handleAddOption = () => {
    const newOption: PollOption = {
      id: `option-${Date.now()}`,
      text: "",
      votes: 0
    };
    setEditedOptions([...editedOptions, newOption]);
  };
  
  const handleRemoveOption = (id: string) => {
    if (editedOptions.length <= 2) {
      toast.error("A poll must have at least 2 options");
      return;
    }
    setEditedOptions(editedOptions.filter((option) => option.id !== id));
  };
  
  const handleSaveEdit = () => {
    if (!editedQuestion.trim()) {
      toast.error("Question cannot be empty");
      return;
    }
    
    const validOptions = editedOptions.filter((option) => option.text.trim() !== "");
    if (validOptions.length < 2) {
      toast.error("A poll must have at least 2 options with text");
      return;
    }
    
    if (!editedEndDate) {
      toast.error("End date is required");
      return;
    }
    
    const updatedPoll: Omit<Poll, "id"> = {
      question: editedQuestion,
      options: validOptions,
      endDate: new Date(editedEndDate).toISOString(),
      postId: poll.postId,
      reference: poll.reference
    };
    
    if (onEdit) {
      onEdit(poll.id, updatedPoll);
      setEditDialogOpen(false);
      toast.success("Poll updated successfully");
    }
  };
  
  // Check if poll has ended
  const hasEnded = new Date(poll.endDate) < new Date();
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Poll
          </CardTitle>
          <div className="flex items-center gap-2">
            {!hasEnded && (
              <div className="text-xs text-muted-foreground">
                Ends {new Date(poll.endDate).toLocaleDateString()}
              </div>
            )}
            
            {isAdmin && (
              <>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Poll</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-question">Question</Label>
                        <Input
                          id="edit-question"
                          value={editedQuestion}
                          onChange={(e) => setEditedQuestion(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Options</Label>
                        {editedOptions.map((option) => (
                          <div key={option.id} className="flex gap-2">
                            <Input
                              value={option.text}
                              onChange={(e) => handleEditOption(option.id, e.target.value)}
                              placeholder="Option text"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveOption(option.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddOption}
                        >
                          Add Option
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-endDate">End Date</Label>
                        <Input
                          id="edit-endDate"
                          type="date"
                          value={editedEndDate}
                          onChange={(e) => setEditedEndDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Poll</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this poll? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 font-medium">{poll.question}</div>
        
        <div className="space-y-3">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 
              ? Math.round((option.votes / totalVotes) * 100) 
              : 0;
              
            return (
              <div key={option.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!voted && !hasEnded ? (
                      <input 
                        type="radio" 
                        name="poll-option" 
                        id={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => setSelectedOption(option.id)}
                        className="text-primary"
                      />
                    ) : null}
                    <label 
                      htmlFor={option.id} 
                      className={`text-sm ${selectedOption === option.id ? 'font-medium' : ''}`}
                    >
                      {option.text}
                    </label>
                  </div>
                  {(voted || hasEnded) && (
                    <span className="text-sm">{percentage}%</span>
                  )}
                </div>
                
                {(voted || hasEnded) && (
                  <Progress value={percentage} className="h-2" />
                )}
              </div>
            );
          })}
        </div>
        
        {!voted && !hasEnded && (
          <Button 
            onClick={handleVote} 
            disabled={!selectedOption}
            className="w-full mt-4"
            size="sm"
          >
            Vote
          </Button>
        )}
        
        {(voted || hasEnded) && (
          <div className="text-center text-sm text-muted-foreground mt-4">
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
            {hasEnded && ' • Poll ended'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
