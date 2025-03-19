
import { useState } from "react";
import { useBlog } from "@/context/BlogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PollWidget } from "@/components/PollWidget";
import { BarChart2, PlusCircle } from "lucide-react";
import { Poll } from "@/types/blog";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const AdminPollsPage = () => {
  const { polls, addPoll, deletePoll, updatePoll } = useBlog();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { id: uuidv4(), text: "", votes: 0 },
    { id: uuidv4(), text: "", votes: 0 },
  ]);
  const [endDate, setEndDate] = useState("");
  const [postId, setPostId] = useState("");
  const [reference, setReference] = useState("OMAR WASHE KONDE");

  const handleOptionChange = (id: string, value: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, text: value } : option
      )
    );
  };

  const addOption = () => {
    setOptions([...options, { id: uuidv4(), text: "", votes: 0 }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    } else {
      toast.error("A poll must have at least 2 options");
    }
  };

  const handleSubmit = () => {
    if (!question) {
      toast.error("Please enter a question");
      return;
    }

    if (!endDate) {
      toast.error("Please select an end date");
      return;
    }

    const validOptions = options.filter((option) => option.text.trim() !== "");
    if (validOptions.length < 2) {
      toast.error("Please enter at least 2 options");
      return;
    }

    const newPoll: Omit<Poll, "id"> = {
      question,
      options: validOptions,
      endDate: new Date(endDate).toISOString(),
      postId: postId || undefined,
      reference: reference || "OMAR WASHE KONDE",
    };

    addPoll(newPoll);
    toast.success("Poll created successfully");

    // Reset form
    setQuestion("");
    setOptions([
      { id: uuidv4(), text: "", votes: 0 },
      { id: uuidv4(), text: "", votes: 0 },
    ]);
    setEndDate("");
    setPostId("");
    setReference("OMAR WASHE KONDE");
    setOpen(false);
  };

  const handleDeletePoll = (pollId: string) => {
    deletePoll(pollId);
    toast.success("Poll deleted successfully");
  };
  
  const handleUpdatePoll = (pollId: string, updatedPoll: Omit<Poll, "id">) => {
    updatePoll(pollId, updatedPoll);
    toast.success("Poll updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Polls</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Poll</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your poll question"
                />
              </div>

              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {options.map((option) => (
                    <div key={option.id} className="flex gap-2">
                      <Input
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(option.id, e.target.value)
                        }
                        placeholder="Enter option text"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(option.id)}
                      >
                        <span className="sr-only">Remove</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                  >
                    Add Option
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Reference Name</Label>
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Enter reference name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postId">Post ID (Optional)</Label>
                <Input
                  id="postId"
                  value={postId}
                  onChange={(e) => setPostId(e.target.value)}
                  placeholder="Enter post ID to associate with"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Create Poll</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {polls.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {polls.map((poll) => (
            <div key={poll.id}>
              <PollWidget 
                poll={poll} 
                onVote={(pollId, optionId) => {}} 
                onDelete={handleDeletePoll} 
                onEdit={handleUpdatePoll}
                isAdmin={true}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border p-8">
          <BarChart2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Polls Yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Create your first poll to engage with your readers.
          </p>
          <Button onClick={() => setOpen(true)}>Create Poll</Button>
        </div>
      )}
    </div>
  );
};

export default AdminPollsPage;
