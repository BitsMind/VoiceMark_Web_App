"use client";

import React, { useEffect, useState } from "react";
import { SquareUserRound, Play, Pause, Download } from "lucide-react";
import API from "@/utils/axiosClient";
import { toast } from "sonner";
import { MyFormData } from "@/types/table";
import { fetchUserProfile } from "@/api/profile";
import { UserProfile } from "@/types/profile";
import { ProfileDetails } from "@/components/account/ProfileDetails";
import { UserStatsCard } from "@/components/account/UserStatsCard";
import { DataTable } from "@/components/table/DataTable";
import { createColumns } from "@/components/table/Column";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { MyForm } from "@/components/table/Form";

export default function Page() {
  const [files, setFiles] = useState<MyFormData[]>([]);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editingUser, setEditingUser] = useState<MyFormData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchFiles = async () => {
    try {
      const res = await API.get("/api/audio/my-files", { withCredentials: true });
      setFiles(res.data.audioFiles);
    } catch (err) {
      console.error("Failed to fetch uploaded files", err);
    }
  };

  useEffect(() => {
    fetchFiles();
    (async () => {
      const data = await fetchUserProfile();
      setProfile(data);
    })();
  }, []);

  const togglePlay = (file: MyFormData) => {
    if (playingId === file.filePath) {
      currentAudio?.pause();
      setPlayingId(null);
      return;
    }
    currentAudio?.pause();
    const audio = new Audio(file.filePath);
    audio.play();
    setCurrentAudio(audio);
    setPlayingId(file.filePath);
    audio.onended = () => setPlayingId(null);
  };

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

  const handleEdit = (record: MyFormData) => {
    setEditingUser(record);
    setIsDialogOpen(true);
  };

  const handleUpdate = (updatedUser: MyFormData) => {
    setFiles(
      files.map((record) => (record.id === updatedUser.id ? updatedUser : record))
    );
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter((record) => record.id !== id));
  };

  const handlemultiDelete = (users: MyFormData[]) => {
    const userIds = new Set(users.map((record) => record.id));
    setFiles(files.filter((record) => !userIds.has(record.id)));
  };

  if (!profile)
    return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const columns = createColumns(togglePlay, playingId, handleDownload);

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
        <div className="lg:col-span-1">
          <ProfileDetails profile={profile} />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <UserStatsCard label="Total Uploads" count={profile.totalAudioFiles} bars={[40, 100, 130, 75, 90]} />
          <UserStatsCard label="Watermarks Detected by Others" count={2} bars={[40, 100, 130, 75, 90]} />
          <UserStatsCard label="Storage" count={2} bars={[40, 100, 130, 75, 90]} />

          <div className="col-span-3">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Your Watermarked Audio Files
            </h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit</DialogTitle>
                  <DialogDescription>
                    Please fill out the form below to update the data.
                  </DialogDescription>
                </DialogHeader>
                <MyForm onSubmit={handleUpdate} initialData={editingUser} />
              </DialogContent>
            </Dialog>
            <DataTable
              columns={columns}
              data={files}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onmultiDelete={handlemultiDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}