
import { Clock } from "lucide-react";

interface ReadingTimeProps {
  content: string;
}

export const ReadingTime = ({ content }: ReadingTimeProps) => {
  // Calculate reading time: average reading speed is 200-250 words per minute
  // We'll use 225 words per minute as our baseline
  const wordsPerMinute = 225;
  
  // Strip HTML tags to get only text content
  const textContent = content.replace(/<[^>]*>/g, "");
  
  // Count words (split by spaces and filter out empty strings)
  const wordCount = textContent.split(/\s+/).filter(Boolean).length;
  
  // Calculate reading time in minutes
  const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
  
  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <Clock className="mr-1 h-4 w-4" />
      <span>{readingTimeMinutes} min read</span>
    </div>
  );
};
