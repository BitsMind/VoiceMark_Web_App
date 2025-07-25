import API from "@/utils/axiosClient";
import { UserProfile } from "@/types/profile";

export async function fetchUserProfile(): Promise<UserProfile> {
  const res = await API.get("/api/auth/user-profile", {
    withCredentials: true,
  });
  const { userStats, totalAudioFiles, totalPages, currentPage } = res.data;

  return {
    name: userStats.name,
    email: userStats.email,
    totalAudioFiles,
    totalPages,
    currentPage,
  };
}

export async function updateUserProfile(
  data: Partial<UserProfile>
): Promise<UserProfile> {
  const res = await API.put("/api/profile/me", data, { withCredentials: true });
  return res.data as UserProfile;
}
