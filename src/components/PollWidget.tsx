
import { useState } from "react";
import { Poll, PollOption } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface PollWidgetProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
}

export const PollWidget = ({ poll, onVote }: PollWidgetProps) => {
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  
  const handleVote = () => {
    if (selectedOption) {
      onVote(poll.id, selectedOption);
      setVoted(true);
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
          {!hasEnded && (
            <div className="text-xs text-muted-foreground">
              Ends {new Date(poll.endDate).toLocaleDateString()}
            </div>
          )}
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
