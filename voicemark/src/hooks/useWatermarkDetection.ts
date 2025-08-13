"use client";

import { useState } from "react";
import { toast } from "sonner";
import { detectWatermark } from "@/api/fileManage";

export interface WatermarkDetectionResult {
  hasWatermark: boolean;
  score: string | null;
  name: string | null;
  message: string | null;
  timestamp: string | null;
  isOwner: boolean;
}

export function useWatermarkDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<WatermarkDetectionResult | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (!acceptedFiles?.length) return;
    setFile(acceptedFiles[0]); // Only allow one file
    setResult(null); // Reset result
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
    });
  };

  const detect = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const fileBase64 = await fileToBase64(file);
      const format = file.name.split(".").pop() || "unknown";

      const res = await detectWatermark({
        audioFile: {
          format,
          fileBase64,
        },
      });

      setResult({
        hasWatermark: res.detected,
        score: res.confidence ?? null,
        name: res.detected ? res.owner?.name ?? null : null,
        message: res.detected
          ? res.message?.content ?? null
          : res.message ?? null,
        timestamp: res.detected ? res.message?.createdAt ?? null : null,
        isOwner: res.detected ? res.isOwner ?? null : null,
      });
      toast.success("Detection complete.");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || "Unknown error";
      toast.error(`Failed to detect watermark: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return {
    file,
    uploading,
    result,
    onDrop,
    removeFile,
    detect,
  };
}
