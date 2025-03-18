
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BarChart2, PlusCircle, Trash2, Edit } from "lucide-react";
import { Poll } from "@/types/blog";
import { toast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const AdminPollsPage = () => {
  const { polls, addPoll } = useBlog();
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
      toast({
        title: "Error",
        description: "A poll must have at least 2 options",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = () => {
    if (!question) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    if (!endDate) {
      toast({
        title: "Error",
        description: "Please select an end date",
        variant: "destructive",
      });
      return;
    }

    const validOptions = options.filter((option) => option.text.trim() !== "");
    if (validOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please enter at least 2 options",
        variant: "destructive",
      });
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
    toast({
      title: "Success",
      description: "Poll created successfully",
    });

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
                        <Trash2 className="h-4 w-4" />
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
        <Card>
          <CardHeader>
            <CardTitle>Active Polls</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {polls.map((poll) => (
                  <TableRow key={poll.id}>
                    <TableCell className="font-medium">
                      {poll.question}
                    </TableCell>
                    <TableCell>{poll.options.length} options</TableCell>
                    <TableCell>
                      {new Date(poll.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{poll.reference || "OMAR WASHE KONDE"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Poll</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this poll? This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
