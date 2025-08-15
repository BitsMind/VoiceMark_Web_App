"use client";

import React, { useEffect, useState } from "react";
import { SquareUserRound } from "lucide-react";
import API from "@/utils/axiosClient";
import { toast } from "sonner";
import { MyFormData } from "@/types/table";
import { fetchUserProfile } from "@/api/profile";
import { UserProfile } from "@/types/profile";
import { ProfileDetails } from "@/components/account/ProfileDetails";
import { UserStatsCard } from "@/components/account/UserStatsCard";
import { DataTable } from "@/components/table/DataTable";
import { createColumns } from "@/components/table/Column";
import { AudioTrack, MiniAudioPlayer } from "@/components/account/AudioPlayer";
import { deleteFile } from "@/api/fileManage";
import { useDeleteDialog } from "@/components/alert/DeleteFileAlert";

export default function Page() {
  const [files, setFiles] = useState<MyFormData[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);

  useEffect(() => {
    (async () => {
      const data = await fetchUserProfile();
      setProfile(data);
      setFiles(data.audioFiles);
    })();
  }, []);

  const handleDownload = async (fileId: string) => {
    try {
      const res = await API.get(`/api/audio/download/${fileId}`, {
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
  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting file...");
    try {
      await deleteFile(id);
      setFiles((prev) => prev.filter((record) => record.id !== id));
      toast.success("File deleted successfully");
    } catch (err) {
      toast.error("Failed to delete file");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handlemultiDelete = async (records: MyFormData[]) => {
    const toastId = toast.loading("Deleting selected files...");
    try {
      await Promise.all(records.map((record) => deleteFile(record.id)));

      const recordIds = new Set(records.map((record) => record.id));
      setFiles((prev) => prev.filter((record) => !recordIds.has(record.id)));

      toast.success("Selected files deleted successfully");
    } catch (err) {
      toast.error("Failed to delete one or more files");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const { showSingle, showMulti, Dialog } = useDeleteDialog({
    onConfirmSingle: handleDelete,
    onConfirmMulti: handlemultiDelete,
  });

  function handleCalculateStorage(): number {
    let converted = 0;
    if (profile) {
      converted = Number((profile.usedStorage / 1024 / 1024).toFixed(2));
    }
    return converted;
  }

  if (!profile)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  const columns = createColumns(handleDownload);

  return (
    <div className="min-h-screen w-full px-6">
      <div className="text-white mb-10">
        <h1 className="text-3xl font-semibold flex items-center gap-4">
          <SquareUserRound className="w-8 h-8" />
          Your Account
        </h1>
        <p className="text-sm text-gray-300">Manage Your Profile and Files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-10 relative">
          <ProfileDetails profile={profile} onUpdate={setProfile} />

          <div className="hidden lg:block">
            <MiniAudioPlayer track={currentTrack} />
          </div>
        </div>

        <div className="lg:col-span-3 grid gap-6 grid-cols-[repeat(auto-fit,_minmax(220px,_1fr))] justify-center">
          <UserStatsCard
            label="Total Uploads"
            count={profile.totalAudioFiles}
            bars={[40, 100, 130, 75, 90]}
          />
          <UserStatsCard
            label="Watermarks Detected by Others"
            count={2}
            bars={[40, 100, 130, 75, 90]}
          />
          <UserStatsCard
            label="/ 500 MB of Available Storage"
            count={handleCalculateStorage()}
            bars={[40, 100, 130, 75, 90]}
          />

          <div className="col-span-3">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Your Watermarked Audio Files
            </h2>
            <DataTable
              columns={columns}
              data={files}
              onDelete={(id) => showSingle(id)}
              onmultiDelete={(records) => showMulti(records)}
              setCurrentTrack={setCurrentTrack}
            />
            <div className="block lg:hidden w-80 mx-auto pb-5">
              <MiniAudioPlayer track={currentTrack} />
            </div>
          </div>
        </div>
      </div>
      {Dialog}
    </div>
  );
}
