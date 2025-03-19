
import { useState, useRef, useEffect } from "react";
import { PodcastEpisode, PodcastTimestamp } from "../types/blog";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Download,
} from "lucide-react";

interface PodcastPlayerProps {
  podcast: PodcastEpisode;
  onClose?: () => void;
}

export const PodcastPlayer = ({ podcast, onClose }: PodcastPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Add event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    // Set initial volume
    audio.volume = volume;

    // Cleanup
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.min(audio.currentTime + 15, audio.duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.max(audio.currentTime - 15, 0);
  };

  const jumpToTimestamp = (timestamp: PodcastTimestamp) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Parse timestamp (e.g., "01:30" -> 90 seconds)
    const [minutes, seconds] = timestamp.time.split(':').map(Number);
    const timeInSeconds = minutes * 60 + seconds;
    
    audio.currentTime = timeInSeconds;
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div className="w-full bg-card border rounded-lg shadow-lg p-4">
      <audio ref={audioRef} src={podcast.audioUrl} preload="metadata" />
      
      <div className="flex items-center mb-4">
        <img 
          src={podcast.thumbnailUrl || `https://picsum.photos/seed/podcast-${podcast.id}/100/100`} 
          alt={podcast.title}
          className="w-16 h-16 rounded object-cover mr-4"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold line-clamp-1">{podcast.title}</h3>
          <p className="text-sm text-muted-foreground">Episode {podcast.episodeNumber}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href={podcast.audioUrl} download target="_blank" rel="noreferrer">
            <Download size={16} className="mr-1" /> Download
          </a>
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={1}
            onValueChange={handleTimeChange}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-3">
            <Button variant="ghost" size="icon" onClick={skipBackward} title="Back 15 seconds">
              <SkipBack size={20} />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="h-10 w-10 rounded-full" 
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={skipForward} title="Forward 15 seconds">
              <SkipForward size={20} />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 w-28 sm:w-36">
            <VolumeIcon />
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
      
      {podcast.timestamps && podcast.timestamps.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Timestamps</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {podcast.timestamps.map((timestamp, index) => (
              <button
                key={index}
                onClick={() => jumpToTimestamp(timestamp)}
                className="flex items-center space-x-2 text-sm py-1 px-2 w-full text-left hover:bg-muted rounded-md"
              >
                <span className="font-mono text-muted-foreground">{timestamp.time}</span>
                <span>{timestamp.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
