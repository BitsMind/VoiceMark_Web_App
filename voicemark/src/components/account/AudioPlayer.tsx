"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

export interface AudioTrack {
  fileName: string;
  filePath: string;
  duration?: number;
}

export function MiniAudioPlayer({ track }: { track: AudioTrack | null }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!track) return;
    
    const audio = new Audio(track.filePath);
    audioRef.current = audio;

    const onLoadedMetadata = () => setDuration(audio.duration);
    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error("Failed to play audio:", error);
        setIsPlaying(false);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [track, isPlaying]); 

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Failed to play audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleSeek = (val: number[]) => {
    const time = val[0];
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  return (
    <div className="rounded-xl bg-zinc-900 p-4 w-full text-white shadow-md">
      <Image
        src="/default.png"
        alt="Audio artwork"
        width={300}
        height={150}
        className="rounded-md w-full object-cover mb-4"
      />

      <div className="text-center mb-2">
        <h3 className="text-base font-semibold">
          {track?.fileName || "No file selected"}
        </h3>
      </div>

      <Slider
        value={[progress]}
        onValueChange={handleSeek}
        max={duration || 100}
        step={0.1}
        className="mb-3"
      />

      <div className="flex justify-between items-center text-sm text-muted-foreground mb-2">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={handleReplay}>
          <RotateCcw className="w-6 h-6" />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}