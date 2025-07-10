import API from "@/utils/axiosClient";

export interface UploadPayload {
  fileName: string;
  fileSize: number;
  format: string;
  fileBase64: string;
  watermarkMessage?: string;
}

export interface DetectPayload {
  format: string;
  fileBase64: string;
}

export async function uploadAudioFile(payload: UploadPayload) {
  try {
    const response = await API.post(
      "/api/audio/upload",
      { newAudioFile: payload },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export async function detectWatermark(payload: { audioFile: DetectPayload }) {
  try {
    const response = await API.post("/api/audio/detect-watermark", payload, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Detection failed:", error);
    throw error;
  }
}

