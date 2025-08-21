import API from "@/utils/axiosClient";
import { UserProfile } from "@/types/profile";

export async function fetchUserProfile(): Promise<UserProfile> {
  const res = await API.get("/api/auth/user-profile", {
    withCredentials: true,
  });
  const { userStats, totalAudioFiles, audioFiles } = res.data;

  return {
    name: userStats.name,
    email: userStats.email,
    totalAudioFiles,
    audioFiles,
    memberSince: userStats.memberSince,
    avatar: userStats.avatar,
    usedStorage: userStats.usedStorage,
    totalDetectionCount: userStats.totalDetectionCount
  };
}

export async function updateUserProfile(
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const res = await API.put("/api/auth/update-profile", {updateData: data}, { withCredentials: true });
  return res.data as UserProfile;
}
