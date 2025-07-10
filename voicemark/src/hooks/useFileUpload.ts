// hooks/useFileUpload.ts
"use client";

import { useState } from "react";
import { uploadAudioFile } from "@/api/fileManage";
import { toast } from "sonner";
import { UploadFile, UploadedFile } from "@/types/file";

export function useFileUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [watermarkMessage, setWatermarkMessage] = useState("");

  const onDrop = (acceptedFiles: File[]) => {
    const allowed = ["mp3", "wav", "flac", "mp4", "m4a"];

    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));

      const filtered = acceptedFiles
        .filter((f) => {
          const ext = f.name.split(".").pop()?.toLowerCase();
          return ext && allowed.includes(ext) && !existingNames.has(f.name);
        })
        .map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          file,
        }));

      return [...prev, ...filtered];
    });
  };

  const removeFile = (name: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
    });
  };

  const uploadFiles = async () => {
    for (const f of files) {
      setUploadingFile(f.name);
      try {
        const fileBase64 = await fileToBase64(f.file);
        const format = f.name.split(".").pop() || "unknown";

        const payload = {
          fileName: f.name,
          fileSize: f.size,
          format,
          fileBase64,
          watermarkMessage: watermarkMessage.trim(),
        };

        const data = await uploadAudioFile(payload);
        setUploadedFiles((prev) => [...prev, data]);
        toast.success(`Uploaded ${f.name}`);
      } catch (error) {
        toast.error(`Failed to upload ${f.name}`);
      } finally {
        setUploadingFile(null);
      }
    }
    setFiles([]);
  };

  return {
    files,
    uploadingFile,
    uploadedFiles,
    watermarkMessage,
    setWatermarkMessage,
    onDrop,
    removeFile,
    uploadFiles,
  };
}
