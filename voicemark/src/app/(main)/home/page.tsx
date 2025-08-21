"use client";

import React, { useState } from "react";
import { Home } from "lucide-react";
import { FileUploadDropzone } from "@/components/file-uploader/UploadDropzone";
import UserUploadedFiles from "@/components/userFiles/UserUploadedFiles";
import { DetectWatermarkDropzone } from "@/components/file-uploader/DetectWatermarkDropzone";

export default function Page() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1); 
  };

  return (
    <div className="min-h-screen w-full px-6">
      <div className="text-white mb-10">
        <h1 className="text-3xl font-semibold flex items-center gap-4">
          <Home className="w-8 h-8" />
          Home
        </h1>
        <p className="text-sm text-gray-300">Secure, Detect, and Own Your Files</p>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2 h-full">
          <FileUploadDropzone onUploadComplete={handleUploadComplete} />
        </div>

        <div className="w-full lg:w-1/2 h-full">
          <UserUploadedFiles refreshTrigger={refreshTrigger} />
        </div>
      </div>
      <div className="mt-5">
        <DetectWatermarkDropzone />
      </div>
    </div>
  );
}
