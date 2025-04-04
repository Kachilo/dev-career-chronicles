
import { useState, useRef } from "react";
import { Upload, X, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PodcastUploaderProps {
  onFileSelected: (file: File) => void;
  onFileRemoved: () => void;
  accept?: string;
  maxSizeMB?: number;
}

export const PodcastUploader = ({
  onFileSelected,
  onFileRemoved,
  accept = "audio/*",
  maxSizeMB = 50
}: PodcastUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file size (MB)
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB. Your file is ${fileSizeMB.toFixed(2)}MB.`,
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    onFileSelected(selectedFile);

    // Create preview URL
    if (selectedFile.type.includes("audio")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileRemoved();
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} bytes`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
          <Label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-3" />
            <span className="text-lg font-medium">Upload your file</span>
            <span className="text-sm text-gray-500 mt-1">
              {accept === "audio/*" 
                ? "MP3, WAV or OGG up to 50MB" 
                : "MP4, WEBM or OGG up to 100MB"}
            </span>
            <Button 
              variant="secondary"
              className="mt-4"
              type="button"
            >
              Select File
            </Button>
            <Input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="sr-only"
            />
          </Label>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Headphones className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="font-medium truncate max-w-[240px]">{file.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {previewUrl && file.type.includes("audio") && (
            <div className="mt-4">
              <audio
                controls
                src={previewUrl}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
