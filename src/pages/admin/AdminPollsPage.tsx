
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useBlog } from "../../context/BlogContext";
import { Poll, PollOption } from "../../types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Check } from "lucide-react";
import { format } from "date-fns";

const AdminPollsPage = () => {
  const { polls, addPoll } = useBlog();
  const [isCreating, setIsCreating] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Omit<PollOption, "votes">[]>([
    { id: uuidv4(), text: "" },
    { id: uuidv4(), text: "" }
  ]);
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [reference, setReference] = useState("OMAR WASHE KONDE");

  const handleAddOption = () => {
    setOptions([...options, { id: uuidv4(), text: "" }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return; // Minimum 2 options
    setOptions(options.filter(option => option.id !== id));
  };

  const handleOptionChange = (id: string, value: string) => {
    setOptions(
      options.map(option =>
        option.id === id ? { ...option, text: value } : option
      )
    );
  };

  const handleCreatePoll = () => {
    // Basic validation
    if (!question.trim()) {
      alert("Please enter a poll question");
      return;
    }

    if (options.some(option => !option.text.trim())) {
      alert("Please fill in all poll options");
      return;
    }

    const newPoll: Omit<Poll, "id"> = {
      question,
      options: options.map(option => ({ ...option, votes: 0 })),
      endDate: new Date(endDate).toISOString(),
      reference
    };

    addPoll(newPoll);
    resetForm();
  };

  const resetForm = () => {
    setQuestion("");
    setOptions([
      { id: uuidv4(), text: "" },
      { id: uuidv4(), text: "" }
    ]);
    setEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setIsCreating(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Polls</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Poll
          </Button>
        )}
      </div>

      {isCreating ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Poll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Poll Question</Label>
                <Textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter your poll question here..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="reference">Reference ID</Label>
                <Input
                  id="reference"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Reference ID for this poll"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Poll Options</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddOption}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div key={option.id} className="flex gap-2">
                      <Input
                        value={option.text}
                        onChange={(e) => handleOptionChange(option.id, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveOption(option.id)}
                        disabled={options.length <= 2}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePoll}>
                  <Check className="h-4 w-4 mr-2" />
                  Create Poll
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="space-y-4">
        <h3 className="text-xl font-medium mb-2">Existing Polls</h3>
        {polls.length === 0 ? (
          <p className="text-muted-foreground">No polls created yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {polls.map(poll => (
              <Card key={poll.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{poll.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">End Date:</span> {format(new Date(poll.endDate), "PP")}
                    </div>
                    {poll.reference && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Reference:</span> {poll.reference}
                      </div>
                    )}
                    <div>
                      <span className="text-sm font-medium">Options:</span>
                      <ul className="list-disc pl-5 mt-1 text-sm">
                        {poll.options.map(option => (
                          <li key={option.id}>
                            {option.text} <span className="text-muted-foreground">({option.votes} votes)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPollsPage;
