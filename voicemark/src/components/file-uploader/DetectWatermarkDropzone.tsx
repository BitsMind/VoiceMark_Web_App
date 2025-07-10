"use client";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useWatermarkDetection } from "@/hooks/useWatermarkDetection";
import { Loader2, UploadCloud } from "lucide-react";

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
    <div className="border rounded-lg p-6 w-full h-full space-y-4 bg-background">
      <div>
        <h2 className="text-lg font-medium mb-1">Detect Watermark in Audio</h2>
        <p className="text-sm text-muted-foreground">
          Upload one audio file (mp3, wav, flac, mp4, m4a) to detect watermark.
        </p>
      </div>

      <div
        {...getRootProps()}
        className="border border-dashed rounded-md h-56 md:h-64 flex items-center justify-center cursor-pointer bg-muted/30"
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

      {result && (
        <div className="space-y-2 pt-4 border-t">
          <p className="text-sm">
            <span className="font-medium">Watermark Detected:  </span>
            {result.hasWatermark ? "Yes" : "No"}

             <span className="font-medium ml-10">Confidence Score:  </span>
            {result.score || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Created By:  </span>
            {result.name || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Message:  </span>
            {result.message || "N/A"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Timestamp:  </span>
            {result.timestamp
              ? new Date(result.timestamp).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
