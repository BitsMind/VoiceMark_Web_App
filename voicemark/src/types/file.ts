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