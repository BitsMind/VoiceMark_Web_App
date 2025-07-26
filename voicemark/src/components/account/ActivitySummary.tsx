import { Flame, UploadCloud, Volume2, FileCheck } from "lucide-react";

export function ActivitySummary({
  totalDetections,
  detectionsToday,
  topFile,
  recentUploads,
}: {
  totalDetections: number;
  detectionsToday: number;
  topFile: string | null;
  recentUploads: number;
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-6 text-white w-full space-y-4 shadow-md">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" />
        Activity Summary
      </h2>

      <div className="space-y-2 text-sm text-zinc-300">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-blue-400" />
          <span>{detectionsToday} detections today</span>
        </div>

        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-green-400" />
          <span>{totalDetections} total detections</span>
        </div>

        <div className="flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-purple-400" />
          <span>{recentUploads} uploads this week</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-white">Top file:</span>
          <span className="truncate">{topFile || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
