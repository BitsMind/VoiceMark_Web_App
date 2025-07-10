"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import API from "@/utils/axiosClient";
import { toast } from "sonner";

interface AudioFile {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  format: string;
}

export default function UserUploadedFiles({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [playingId, setPlayingId] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      const res = await API.get("/api/audio/my-files", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setFiles(res.data.audioFiles || []);
    } catch (err) {
      console.error("Failed to fetch uploaded files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const togglePlay = (file: AudioFile) => {
    if (playingId === file.filePath) {
      currentAudio?.pause();
      setPlayingId(null);
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
    }

    const audio = new Audio(file.filePath);
    audio.play();
    setCurrentAudio(audio);
    setPlayingId(file.filePath);

    audio.onended = () => {
      setPlayingId(null);
    };
  };

  const handleDownload = async (audioFileId: string) => {
    try {
      const res = await API.get(`/api/audio/download/${audioFileId}`, {
        withCredentials: true,
      });

      const downloadUrl = res.data.downloadUrl;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("Download failed:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to download file.");
    }
  };

  if (!files.length) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="p-6 text-center text-muted-foreground text-sm">
          No uploaded audio files found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[495px] flex flex-col">
      <CardContent className="p-4 flex flex-col flex-1 min-h-0">
        <h3 className="text-lg font-medium mb-4">
          Your Watermarked Audio Files
        </h3>

        {/* Scrollable container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="text-center border-b border-muted-foreground/20">
                <th className="py-2">File Name</th>
                <th className="py-2">Size</th>
                <th className="py-2">Format</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-muted/20 text-center">
                  <td className="py-2">{file.fileName}</td>
                  <td className="py-2">
                    {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                  </td>
                  <td className="py-2 uppercase">{file.format}</td>
                  <td className="py-2">
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePlay(file)}
                        className="flex gap-1 items-center"
                      >
                        {playingId === file.filePath ? (
                          <>
                            <Pause className="w-4 h-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Play
                          </>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(file.id)}
                        className="flex gap-1 items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v6m0 0l3-3m-3 3l-3-3m0-6a4 4 0 118 0"
                          />
                        </svg>
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
