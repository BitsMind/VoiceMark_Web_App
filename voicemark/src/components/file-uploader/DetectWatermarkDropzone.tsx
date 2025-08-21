"use client";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWatermarkDetection } from "@/hooks/useWatermarkDetection";
import {
  CheckCircle2,
  XCircle,
  UploadCloud,
  User,
  MessageSquareText,
  CalendarDays,
  BrainCog,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import DetectionSummary from "./DetectionSummary";
import { HelpTooltip } from "../help-card/HelpToolTip";

export function DetectWatermarkDropzone() {
  const { file, uploading, result, onDrop, removeFile, detect } =
    useWatermarkDetection();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/flac": [".flac"],
      "video/mp4": [".mp4", ".m4a"],
    },
  });

  return (
    <div className="relative border rounded-lg p-6 w-full h-full space-y-4 bg-background my-5 pb-8">
      <HelpTooltip text="Detect watermark in audio files here. You can detect 1 file each time. The result will be display, along with the Confidence score from 0 to 1 (0 is most likely no watermark detected, 1 is most likely a watermark detected). Keep in mind, the info display is different based on whether you are the owner of the file or not" />
      <div>
        <h2 className="text-lg font-medium mb-1">Detect Watermark in Audio</h2>
        <p className="text-sm text-muted-foreground">
          Upload one audio file (mp3, wav, flac, mp4, m4a) to detect watermark.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Dropzone Area */}
        <div className="w-full md:w-1/2 space-y-3">
          <div
            {...getRootProps()}
            className="border border-dashed rounded-md h-56 flex items-center justify-center cursor-pointer bg-muted/30"
          >
            <input {...getInputProps()} />
            <div className="text-center space-y-1">
              <UploadCloud className="w-6 h-6 mx-auto" />
              <p className="text-sm">
                {isDragActive ? "Drop here" : "Drag & drop or click to browse"}
              </p>
            </div>
          </div>

          {file && (
            <div className="flex justify-between items-center border rounded-md px-3 py-2 bg-background">
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex items-center gap-2">
                {uploading && (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {file && (
            <Button onClick={detect} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Detecting...
                </>
              ) : (
                "Detect Watermark"
              )}
            </Button>
          )}
        </div>

        <Separator
          orientation="vertical"
          className="hidden md:block h-auto bg-white"
        />

        {/* Results */}
        <div className="w-full md:w-1/2 space-y-4 border rounded-md p-4 bg-muted/20">
          <h3 className="text-md font-semibold">Detection Results</h3>

          {!result ? (
            <p className="text-sm text-muted-foreground">No result yet.</p>
          ) : (
            <div className="space-y-3">
              <div className="space-y-4 pt-4 border-t">
                <DetectionSummary result={result} />
              </div>

              <div className="flex items-center gap-2 text-sm">
                {result.hasWatermark ? (
                  <CheckCircle2 className="text-green-500 w-5 h-5" />
                ) : (
                  <XCircle className="text-red-500 w-5 h-5" />
                )}
                <span>
                  Watermark Detected:{" "}
                  <strong>{result.hasWatermark ? "Yes" : "No"}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <BrainCog className="w-4 h-4" />
                Confidence Score:{" "}
                <span className="ml-1">{result.score ?? "N/A"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                Created By: <span className="ml-1">{result.name || "N/A"}</span>
              </div>

              <div className="flex items-start gap-2 text-sm">
                <MessageSquareText className="w-4 h-4 mt-0.5" />
                Message:{" "}
                <span className="ml-1 break-all">
                  {result.message || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="w-4 h-4" />
                Timestamp:{" "}
                <span className="ml-1">
                  {result.timestamp
                    ? new Date(result.timestamp).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
