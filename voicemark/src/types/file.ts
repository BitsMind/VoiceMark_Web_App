export interface UploadFile {
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface UploadedFile {
  fileName: string;
  filePath: string;
  fileSize: number;
  format: string;
}

export interface FileDetails {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileSizeFormatted: string;
  format: string;
  duration: number;
  watermarkMessage: string | null;
  watermarkDetectionCount: number;
  lastDetectedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
