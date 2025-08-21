import { FileDetails } from "./file";

export interface UserProfile {
  name: string;
  email: string;
  totalAudioFiles: number;
  memberSince: string;
  avatar: string;
  usedStorage: number;
  audioFiles: FileDetails[]
  totalDetectionCount: number
}
