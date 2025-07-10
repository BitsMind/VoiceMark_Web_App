// components/file-uploader/FileUploadDropzone.tsx
"use client";

import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Loader2, UploadCloud } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export function FileUploadDropzone({
  onUploadComplete,
}: {
  onUploadComplete?: () => void;
}) {
  const {
    files,
    uploadingFile,
    onDrop,
    removeFile,
    uploadFiles: uploadAllFiles,
    watermarkMessage,
    setWatermarkMessage,
  } = useFileUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/flac": [".flac"],
      "video/mp4": [".mp4", ".m4a"],
    },
  });

  const handleUpload = async () => {
    await uploadAllFiles();
    onUploadComplete?.();
  };

  return (
    <div className="border rounded-lg p-6 w-full h-full space-y-4 bg-background">
      <div>
        <h2 className="text-lg font-medium mb-1">Upload Audio(s) to Watermark</h2>
        <p className="text-sm text-muted-foreground">
          Drag and drop audio files (mp3, wav, flac, mp4, m4a)
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

      {/* Watermark message */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Watermark Message (max 500 characters)
        </label>
        <Textarea
          placeholder="Enter your secret watermark message here..."
          value={watermarkMessage}
          onChange={(e) => setWatermarkMessage(e.target.value.slice(0, 500))}
          maxLength={500}
          className="resize-none"
        />
      </div>

      {/* Selected files list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.name}
            className="flex justify-between items-center border rounded-md px-3 py-2 bg-background"
          >
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex items-center gap-2">
              {uploadingFile === file.name && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              )}
              <button
                onClick={() => removeFile(file.name)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload button */}
      {files.length > 0 && (
        <Button onClick={handleUpload} disabled={!!uploadingFile}>
          {uploadingFile ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Watermarking...
            </>
          ) : (
            "Watermark File(s)"
          )}
        </Button>
      )}
    </div>
  );
}
